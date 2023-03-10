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

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async chats => {
        const result = await User.populate(chats, {
          path: "latestMessage.sender",
          select: "name pic email",
        })

        res.status(200).send(result)
      })
  } catch (err) {
    res.sendStatus(400)
    throw new Error(err.message)
  }
})

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    console.log("Please provide chat name and users")
    return res.sendStatus(400)
  }

  let users = JSON.parse(req.body.users)

  if (users.length < 2) {
    return res.status(400).send("Please select at least two users")
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    res.status(200).json(fullGroupChat)
  } catch (err) {
    res.sendStatus(400)
    throw new Error(err.message)
  }
})

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (updatedChat) {
    res.status(200).json(updatedChat)
  } else {
    res.sendStatus(400)
    throw new Error("Chat not found")
  }
})

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (added) {
    res.status(200).json(added)
  } else {
    res.sendStatus(400)
    throw new Error("Chat not found")
  }
})

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (removed) {
    res.status(200).json(removed)
  } else {
    res.sendStatus(400)
    throw new Error("Chat not found")
  }
})

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
}
