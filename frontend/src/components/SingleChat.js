import React, { useEffect, useState } from "react"
import { ChatState } from "../context/ChatProvider"
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender, getSenderFull } from "../config/ChatLogics"
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import axios from "axios"
import "./styles.css"
import ScrollableChat from "./ScrollableChat"
import { io } from "socket.io-client"

const ENDPOINT = "http://localhost:4000"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessages] = useState()
  const [socketConnected, setSocketConnected] = useState(false)

  const toast = useToast()
  const { user, selectedChat, setSelectedChat } = ChatState()

  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      setLoading(true)
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      )
      setMessages(data)
      setLoading(false)
      socket.emit("join chat", selectedChat._id)
    } catch (e) {
      toast({
        title: "Error",
        description: "Error fetching messages",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedChat])
  const sendMessage = async event => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
        setNewMessages("")
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        )

        setMessages([...messages, data])
      } catch (e) {
        toast({
          title: "Error",
          description: "Error sending message",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connection", () => setSocketConnected(true))
  }, [])

  const typingHandler = e => {
    setNewMessages(e.target.value)

    // Typing Indicator Logic
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Average Sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              aria-label="back"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="e0e0e0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Average Sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
