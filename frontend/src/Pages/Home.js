import React, { useEffect } from "react"
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react"
import Login from "../components/authentication/Login"
import Register from "../components/authentication/Register"
import { useHistory } from "react-router-dom"

const Home = () => {
  const history = useHistory()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (userInfo) {
      history.push("/chats")
    }
  }, [history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Average Sans">
          Bebe Time
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="solid-rounded" colorScheme="pink">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
