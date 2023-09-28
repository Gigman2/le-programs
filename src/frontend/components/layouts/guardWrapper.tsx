/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import {  ReactNode, useEffect, useState } from 'react'
import { Box, Flex, Text} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { IAccountUser, getUser } from '@/utils/auth';

const GuardWrapper = ({allowed, app,  redirectTo, children}: {allowed: string[]; app: string; redirectTo?: string; children: ReactNode}) => {
    
    const router = useRouter()
    const [userAllowed, setUserAllowed] = useState<boolean>()

    useEffect(() => {
        const user = getUser() as IAccountUser
        console.log('User ', user)
        if(!user) router.push(`/${app}/login`)

        const isAllowed = user?.roles?.map(item => item.groupType).every(userRole => allowed.includes(userRole))
        setUserAllowed(isAllowed)
        console.log(redirectTo)
        // if(redirectTo) router.push(`/${redirectTo}`)
    },[])
  return (
    <>
        {!userAllowed ? 
        <Box mb={4} p={4} bg="red.400" color={"white"} textAlign={"center"}>
            <Text>Oops it appears you don&apos;t have access here kindly reach out to an admin for access</Text>
        </Box> : children}
    </>
  )
}


export default GuardWrapper
