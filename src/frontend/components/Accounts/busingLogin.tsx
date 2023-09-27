/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, FormLabel, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { handleChange } from '@/utils/form';

import { IBusAccount } from '@/interface/bus';
import { IAccountUser, getUser, saveBusUser } from '@/utils/auth';

export type GroupedUnits = Record<string, {name?: string, id?: string}>

export default function BusingLogin() {
    const router = useRouter()
    const [userAccount, setUserAccount] = useState<IBusAccount>()
    const [loading, setLoading] = useState(false)
    const [fields, setFIelds] = useState< Record<string, string | null | Record<string, string>>>({
      id: '',
      group:  null
    })

      const gotoBusPage = (roles: ("BUS_REP" | "BRANCH_HEAD" | "SECTOR_HEAD" | "OVERALL_HEAD")[]) => {
         if(roles?.includes('BUS_REP')){
            router.push('/bus/bus-rep/logs')
        } else if(roles?.includes('BRANCH_HEAD')){
            router.push('/bus/branch-head')
        } else if(roles?.includes('SECTOR_HEAD')){
            router.push('/bus/sector-head')
        }
    }

    useEffect(() => {
        const user = getUser()
        if(user?.currentApp === 'BUSING'){
            gotoBusPage(user?.roles || [])
        }
    }, [])

    const createUnitObj = (data: {groupType: string; group: string}[]) => {
        return data.reduce((acc: GroupedUnits, cValue) => {
            acc[cValue.groupType] = {
                id: cValue.group
            }
            return acc
        }, {})
    }

    const handleContinue = () => {
        try {
            setLoading(true)
                const user: IAccountUser = {
                name: userAccount?.name as string,
                bus: createUnitObj( userAccount?.accountType as IBusAccount['accountType']),
                accountId: userAccount?._id as string,
                roles: userAccount?.accountType as any[],
                currentApp: "BUSING"
            }
            saveBusUser(user)
            gotoBusPage(user?.roles || [])
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
       
    }

    return (
    <>
        { (!fields['id']?.length || !fields['group']) &&  !(!fields['id']?.length && !fields['group']) ? 
            <Box 
                mb={4} 
                bg="red.400" 
                rounded={"sm"} 
                color="white" 
                px={4} py={3} 
                w="100%"
            >
                You&lsquo;ve either not selected an ID or a Bus Unit</Box>
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
            <Input type='password' fontSize={14} placeholder='Enter ID Here ' value={fields.password as string } 
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
