/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router'
import { handleChange, validate } from '@/utils/form';
import { clearUser, saveUser } from '@/utils/auth';
import Autocomplete from '@/frontend/components/Forms/Autocomplete';
import { IBusGroups } from '@/interface/bus';

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

export default function BacentaRep() {
    const toast = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<IModifiedBusGroup[]>([])
    const [disabled, setDisabled] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Record<string, string | string[]>>({})
    const [showIsRep, setShowIsRep] = useState(false)
    const [fields, setFIelds] = useState< Record<string, string>>({
      id: '',
      group: ''
    })

    const [errors, setErrors] = useState<Record<string, string | undefined>>({
        id: undefined,
        group: undefined,
        groupName: undefined
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL

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
          const res = await fetch(`${baseUrl}/api/bus_groups/getBusGroups`, {
            method: 'get',
          })
          const groups = await res.json()
          let groupData = groups.data as IBusGroups[]
          const modifiedData = groupData.map(item => ({label: item._id, value: item.groupName, busReps: item.busReps, stations: item.stations}))
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
        const user: ILocalUser = {name: fields.id.toLowerCase(), group: fields.group, isRep: false, groupName: selected.groupName as string}

        const item = data.filter(item => {
            return item.label === user.group
        })
        if(item.length){
            const itemPart = item[0]
            const isARep = itemPart.busReps.includes(user.name)
            if(isARep){
                user.isRep = true
                user.groupStations = itemPart.stations
                router.push(`/bus-round`)
            }
        }
        saveUser(
            user.name, 
            user.group, 
            user.isRep, 
            user.groupName, 
            user.groupStations
        )
    }

    useEffect(() => {
        if(fields.id && fields.group && data){
            const item = data.filter(item => {
                return item.label === fields.group
            })
            if(item.length){
                const itemPart = item[0]
                const isARep = itemPart.busReps.includes(fields.id.toLowerCase())
                setShowIsRep(isARep)
            }
        }

    }, [fields, data])

    return (
    <>
        <Box mb={6}>
            <FormLabel fontSize={14} color="gray.700">Enter registered ID</FormLabel>
            <Input placeholder='ID here' value={fields.id } 
            onChange={v =>   handleChange(v.currentTarget?.value, 'id', fields, setFIelds)}
            />
        </Box>
        <Box my={4}>
            <Text fontWeight={600} fontSize={14} color="gray.600">Stations in Zone</Text>
            <Box p={2} bg={'gray.100'} rounded="md">
                {(selected?.stations as string[])?.map((item: string) => <Text key={item} fontSize={14} color={"gray.600"} my={1}>{item}</Text>)}
            </Box>
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
                onSelected={(item: Record<string, string>) => 
                    setSelected(item) 
                }
            />
            {(!showIsRep && search !== '') && <Text fontSize={12} color="red.400">You are not a bus rep here</Text>}
            </Box>
            <Box as={Button} 
                colorScheme="black"
                px={5}
                py={2}
                mt={24}
                w={"100%"}
                color="white" 
                onClick={() => handleClick()}
                bg={ "base.blue" }
                _hover={{bg:  "base.blue" }}
                isDisabled={disabled || search === '' || !showIsRep}
            >{search === '' ? 'Select a zone to continue' : 'Next'}
            </Box>
        </Box> : 
        <Flex w="100%" h={48} align="center" justify={"center"}>
            <Text fontWeight={600}>Loading please wait ...</Text>
        </Flex>}
    </>
  )
}
