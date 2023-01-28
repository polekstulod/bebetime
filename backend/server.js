const express = require("express")
const dotenv = require("dotenv")
const { chats } = require("./data/data.js")
const connectDB = require("./config/db.js")
const colors = require("colors")

const app = express()
dotenv.config()
connectDB()

app.get("/", (req, res) => {
  res.send("API is running successfully")
})

app.get("/api/chat", (req, res) => {
  res.send(chats)
})

app.get("/api/chat/:id", (req, res) => {
  const chat = chats.find(c => c._id === req.params.id)
  res.send(chat)
})

const PORT = process.env.PORT || 4000

app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.black.bgYellow.bold)
)
