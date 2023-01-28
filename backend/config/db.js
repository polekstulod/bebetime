const mongoose = require("mongoose")
const colors = require("colors")

mongoose.set("strictQuery", false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`.black.bgGreen.bold)
  } catch (error) {
    console.error(`Error: ${error.message}`.black.bgRed.bold)
    process.exit(1)
  }
}

module.exports = connectDB
