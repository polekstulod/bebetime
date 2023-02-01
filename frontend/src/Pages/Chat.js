import React from "react"
import { ChatState } from "../context/ChatProvider"
import { Box } from "@chakra-ui/react"
import SideDrawer from "../components/miscellaneous/SideDrawer"
import MyChats from "../components/miscellaneous/MyChats"
import ChatBox from "../components/miscellaneous/ChatBox"

const Chat = () => {
  const { user } = ChatState()

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  )
}

export default Chat
