/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import {  ReactNode, useEffect, useState } from 'react'
import { Box, Flex, Text} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { IAccountUser, getUser, removeSession } from '@/frontend/store/auth';


const GuardWrapper = ({allowed, app,  redirectTo, children}: {allowed: string[]; app: string; redirectTo?: string; children: ReactNode}) => {
    
    const router = useRouter()
    const [userAllowed, setUserAllowed] = useState<boolean>()

    const handleRemoveSession = () => {
      removeSession()
      const user = getUser() as IAccountUser
        if(!user) router.push(`/${app}/login`)
    }

    useEffect(() => {
        const user = getUser() as IAccountUser
        if(!user) router.push(`/${app}/login`)

        console.log(allowed)
        const isAllowed = user?.roles?.map(item => item.groupType).every(userRole => allowed.includes(userRole))
        setUserAllowed(isAllowed)
    },[])
  return (
    <>
        {!userAllowed ? 
        <Box>
          <Box mb={4} p={4} bg="red.400" color={"white"} textAlign={"center"}>
            <Text>Oops it appears you don&apos;t have access here kindly reach out to an admin for access</Text>
          </Box>

          <Flex width={"100%"} justify={"center"} mt={12}>
            <Box 
              p={4} 
              bg="black" 
              color={"white"} 
              rounded={"md"} 
              cursor={"pointer"}
              onClick={() => handleRemoveSession()}
            >Back to login</Box>
          </Flex>
        </Box> : children}
    </>
  )
}


export default GuardWrapper
