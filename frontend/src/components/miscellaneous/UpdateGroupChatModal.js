import React, { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"
import { ChatState } from "../../context/ChatProvider"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import axios from "axios"
import UserListItem from "../UserAvatar/UserListItem"

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast()

  const { selectedChat, setSelectedChat, user } = ChatState()

  const handleRemove = async user => {
    if (selectedChat.groupAdmin._id !== user._id && user._id !== user._id) {
      toast({
        title: "Error",
        description: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      )

      user._id === user._id ? setSelectedChat() : selectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (e) {
      toast({
        title: "Error",
        description: e.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const data = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (e) {
      toast({
        title: "Error",
        description: e.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setRenameLoading(false)
    }

    setGroupChatName("")
  }

  const handleSearch = async query => {
    setSearch(query)
    if (!query) return

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.get(`/api/user?search=${query}`, config)
      setLoading(false)
      setSearchResult(data)
    } catch (e) {
      toast({
        title: "Error",
        description: e.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  const handleAddUser = async user => {
    if (selectedChat.users.find(u => u._id === user._id)) {
      toast({
        title: "Error",
        description: "User already in group",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Error",
        description: "You are not the group admin",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (e) {
      toast({
        title: "Error",
        description: e.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="view"
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Average Sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="blue"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Rename
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map(u => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
