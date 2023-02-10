import React, { useState } from "react"
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ChatState } from "../../context/ChatProvider"

const Register = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [loading, setLoading] = useState()
  const toast = useToast()
  const history = useHistory()

  const { setUser } = ChatState()

  const handleClick = () => setShow(!show)

  const submitHandler = async () => {
    setLoading(true)

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, confirmPassword },
        config
      )

      toast({
        title: "Registration Successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      setUser(userInfo)
      history.push("/chats")
    } catch (error) {
      toast({
        title: "Registration Failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="full-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={e => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={e => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={e => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={e => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="pink"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  )
}

export default Register
