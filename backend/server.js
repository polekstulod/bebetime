const express = require("express")
const dotenv = require("dotenv")
const { chats } = require("./data/data.js")
const connectDB = require("./config/db.js")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes.js")

const app = express()
dotenv.config()
connectDB()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("API is running successfully")
})

app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 4000

app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.black.bgYellow.bold)
)
