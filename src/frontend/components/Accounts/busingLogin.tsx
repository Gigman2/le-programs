/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, FormLabel, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { handleChange } from '@/utils/form';

import { IBusAccount } from '@/interface/bus';
import { IAccountUser, getUser, saveBusUser, saveUserToken } from '@/utils/auth';
import { useLoginRequest } from '@/frontend/apis';

export type GroupedUnits = Record<string, {name?: string, id?: string}>

export default function BusingLogin() {
    const router = useRouter()
    const [userAccount, setUserAccount] = useState<IBusAccount>()
    const [loading, setLoading] = useState(false)
    const [fields, setFIelds] = useState< Record<string, string | null | Record<string, string>>>({
      email: '',
      password:  ''
    })
    const authLogin = useLoginRequest()

    const gotoBusPage = () => {
        router.push('/bus')
    }


    useEffect(() => {
        const user = getUser()
        if(user?.currentApp === 'BUSING'){
            gotoBusPage()
        }
    }, [])


    const handleContinue = async () => {
        try {
            setLoading(true)
            await authLogin.mutate({email: fields.email, password: fields.password})
            const loginData = authLogin.data?.data.data as {account: IBusAccount, token: string; user: any}

            const user: IAccountUser = {
                name: loginData.account.name,
                bus: {},
                accountId: loginData?.account._id as string,
                roles: userAccount?.accountType as any[],
                currentApp: "BUSING"
            }

            saveBusUser(user)
            saveUserToken(loginData.token)
            gotoBusPage()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
       
    }

    return (
    <>
        { (!fields['email']?.length || !fields['password']) &&  !(!fields['email']?.length && !fields['password']) ? 
            <Box 
                mb={4} 
                bg="red.400" 
                rounded={"sm"} 
                color="white" 
                px={4} py={3} 
                w="100%"
            >
                You&lsquo;ve either not entered an email or a password</Box>
                : null
        }
        <Box mb={6} fontSize={14}>
            <FormLabel color="gray.700">Enter email</FormLabel>
            <Input fontSize={14} placeholder='Enter ID Here ' value={fields.email as string } 
            onChange={v =>   handleChange(v.currentTarget?.value, 'email', fields, setFIelds)}
            />
        </Box>

         <Box mb={6} fontSize={14}>
            <FormLabel color="gray.700">Enter password</FormLabel>
            <Input type='password' fontSize={14} placeholder='Enter password Here ' value={fields.password as string } 
            onChange={v =>   handleChange(v.currentTarget?.value, 'password', fields, setFIelds)}
            />
        </Box>
        
        <Box as={Button} 
            colorScheme="black"
            px={5}
            py={2}
            mt={8}
            w={"100%"}
            color="white" 
            onClick={() => handleContinue()}
            bg={ "base.blue" }
            _hover={{bg:  "base.blue" }}
            isLoading={loading}
            isDisabled={loading}
        >Continue</Box>
    </>
  )
}
