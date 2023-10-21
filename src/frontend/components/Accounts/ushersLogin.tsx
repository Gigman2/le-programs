/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router'
import { handleChange, validate } from '@/utils/form';
import { clearUser } from '@/frontend/store/auth';
import { getUser, saveUser } from '@/frontend/store/temporalUshering';

interface IModifiedBusGroup {
    label?: string,
    stations: string[],
    busReps: string[],
    value: string
}

interface ILocalUser {
    name: string
}

export default function UshersLogin() {
    const router = useRouter()
    const [disabled, setDisabled] = useState(false)
    const [fields, setFIelds] = useState< Record<string, string>>({
        id: ''
    })

    const gotoHome = () => {
        router.push('/ushers')
    }
    useEffect(() => {
        const user = getUser()
        if(user?.currentApp === 'USHERING'){
            gotoHome()
        }
    }, [])

    const [errors, setErrors] = useState<Record<string, string | undefined>>({
        id: undefined,
    })

    const required = ['id']
    useEffect(() => {
        const hasError = validate(required, errors, fields, setErrors)
        setDisabled(hasError)
    }, [fields])
  
    const handleClick = () => {
        clearUser()
        const user: ILocalUser = {name: fields.id.toLowerCase()}
        router.push(`/ushers`)
        saveUser(
            user.name,
            'USHERING'
        )
    }

    return (
    <>
        <Box mb={6}>
              <FormLabel fontSize={14} color="gray.700">Enter Name</FormLabel>
              <Input placeholder='Name here' value={fields.id } 
                onChange={v =>   handleChange(v.currentTarget?.value, 'id', fields, setFIelds)}
              />
        </Box>
        <Box as={Button} 
                px={5}
                py={2}
                mt={24}
                w={"100%"}
                bg={"base.blue" }
                color="white" 
                _hover={{bg: "base.blue" }}
                onClick={() => handleClick()}
                isDisabled={disabled}
            >Continue
        </Box>
    </>
)}
