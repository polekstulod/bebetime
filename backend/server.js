const express = require("express")
const dotenv = require("dotenv")
const { chats } = require("./data/data.js")
const connectDB = require("./config/db.js")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes = require("./routes/messageRoutes.js")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const app = express()
dotenv.config()
connectDB()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("API is running successfully")
})

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.black.bgYellow.bold)
)

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", socket => {
  console.log("Connected to Socket.io".black.bgBlue.bold)

  socket.on("setup", userData => {
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join chat", room => socket.join(room))

  socket.on("typing", room => socket.in(room).emit("typing"))
  socket.on("stop typing", room => socket.in(room).emit("stop typing"))

  socket.on("new message", newMessageReceived => {
    let chat = newMessageReceived.chat

    if (!chat.users) return console.log("Chat.users not defined")

    chat.users.forEach(user => {
      if (user._id === newMessageReceived.sender._id) return

      socket.in(user._id).emit("message received", newMessageReceived)
    })
  })

  socket.off("setup", userData => socket.leave(userData._id))
})
