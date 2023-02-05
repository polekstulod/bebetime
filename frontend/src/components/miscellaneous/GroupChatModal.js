import React, { useState } from "react"
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react"
import { ChatState } from "../../context/ChatProvider"
import axios from "axios"
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const { user, chats, setChats } = ChatState()

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
      setSearchResult(data)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fileds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
      return
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map(user => user._id)),
        },
        config
      )

      setChats([data, ...chats])
      onClose()
      toast({
        title: "Group Chat Created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (error) {
      toast({
        title: "Failed to Create the Chat",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const handleGroup = async userToAdd => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleDelete = delUser => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Average Sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users eg: Micah, Hanni, Hyein"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUsers.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
