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
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"
import { ChatState } from "../../context/ChatProvider"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import axios from "axios"

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const toast = useToast()

  const { selectedChat, setSelectedChat, user } = ChatState()

  const handleRemove = () => {}

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

  const handleSearch = () => {}

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
