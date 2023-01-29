const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    console.log("No user id provided")
    return res.sendStatus(400)
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage")

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  })

  if (isChat.length > 0) {
    res.send(isChat[0])
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    }

    try {
      const newChat = await Chat.create(chatData)

      const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      )

      res.status(200).send(fullChat)
    } catch (err) {
      res.sendStatus(400)
      throw new Error(err.message)
    }
  }
})

module.exports = { accessChat }
