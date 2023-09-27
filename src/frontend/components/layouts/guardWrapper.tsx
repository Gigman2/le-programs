/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import {  ReactNode, useEffect, useState } from 'react'
import { Box, Flex, Text} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { IAccountUser, getUser } from '@/utils/auth';

const PageWrapper = ({allowed, app,  redirectTo, children}: {allowed: string[]; app: string; redirectTo?: string; children: ReactNode}) => {
    
    const router = useRouter()
    const [userAllowed, setUserAllowed] = useState<boolean>()

    useEffect(() => {
        const user = getUser() as IAccountUser
        if(!user) router.push(`/${app}/login`)

        const isAllowed = user.roles.every(userRole => allowed.includes(userRole))
        setUserAllowed(isAllowed)
        if(redirectTo) router.push(`/${redirectTo}`)
    },[])
  return (
    <>
        {!userAllowed ? 
        <Box my={4} p={4} bg="red.500">
            <Text>Oops it appears you don&apos;t have access here</Text>
        </Box> : children}
    </>
  )
}


export default PageWrapper
