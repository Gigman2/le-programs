/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router'
import { handleChange, validate } from '@/utils/form';
import { clearUser, saveUser } from '@/frontend/store/auth';
import Autocomplete from '@/frontend/components/Forms/Autocomplete';
import { IBusGroups } from '@/interface/bus';
import { getBusGroupsApi } from "@/frontend/apis";

interface IModifiedBusGroup {
    label?: string,
    stations: string[],
    busReps: string[],
    value: string
}

interface ILocalUser {
    name: string, 
    group: string, 
    isRep: boolean, 
    groupName: string,
    groupStations?: string[]
}

export default function Shepherd() {
    const toast = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<IModifiedBusGroup[]>([])
    const [disabled, setDisabled] = useState(false)
    const [search, setSearch] = useState('')
    const [fields, setFIelds] = useState< Record<string, string>>({
      id: '',
      group: '',
      groupName: ''
    })

    const [errors, setErrors] = useState<Record<string, string | undefined>>({
        id: undefined,
        group: undefined,
        groupName: undefined
    })



    const toastMessage: { 
    title: string; 
    status: "success" | "loading" | "error" | "info" | "warning" | undefined; 
    duration: number; 
    isClosable: boolean; 
    position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' |'bottom-left'
  } = {
      title: "Bus updated successfully",
      status: "success",
      position: 'top-right',
      duration: 9000,
      isClosable: true,
  }

    const fetchGroup = async () => {
      try {
        setLoading(true)
        const res = await getBusGroupsApi()
        const groups = await res.json()
        let groupData = groups.data as IBusGroups[]
        const modifiedData = groupData.map(item => ({
            label: item._id, 
            value: item.groupName, 
            busReps: item.busReps, 
            stations: item.stations
        }))
            setData(modifiedData)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toastMessage.title = 'An error occurred'
            toastMessage.status = 'error'
            toast(toastMessage)
        }
    }
    
    useEffect(() => {
      fetchGroup()
    }, [])

    const required = ['id']
    useEffect(() => {
        const hasError = validate(required, errors, fields, setErrors)
        setDisabled(hasError)
    }, [fields])
  
    const handleClick = () => {
        clearUser()
        const user: ILocalUser = {name: fields.id.toLowerCase(), group: fields.group, isRep: false, groupName: fields.groupName}
        const item = data.filter(item => {
            return item.label === fields.group
        })
        if(item.length){
            const itemPart = item[0]
            user.isRep = true
            user.groupStations = itemPart.stations
            router.push(`/shepherd`)
        }
        saveUser(
            user.name, 
            user.group, 
            user.isRep, 
            user.groupName, 
            user.groupStations
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
        {!loading ? <Box>
            <Box>
            <FormLabel fontSize={14} color="gray.700">Type and select zone</FormLabel>
            <Autocomplete 
                name='group'
                noMatch={item => null}
                data={data as unknown as Record<string, string>[]}
                fields={fields}
                setFields={setFIelds as unknown as Dispatch<SetStateAction<Record<string, string | boolean | undefined>>>}
                placeholder='Enter zone name here ...'
                queryValue={(query) => null}
                search={search}
                setSearch={setSearch}
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
                isDisabled={disabled || search === ''}
            >Continue
            </Box>
        </Box> : 
        <Flex w="100%" h={48} align="center" justify={"center"}>
            <Text fontWeight={600}>Loading please wait ...</Text>
        </Flex>}
    </>
  )
}
