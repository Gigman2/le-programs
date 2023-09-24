/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, FormLabel, Input, Skeleton, Text } from '@chakra-ui/react'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router'
import { handleChange, validate } from '@/utils/form';

import Autocomplete from '@/frontend/components/Forms/Autocomplete';
import { useBusAccount, useBusGroups } from '@/frontend/apis';
import { IBusAccount, IBusGroups } from '@/interface/bus';

export default function BacentaRep() {
    const router = useRouter()
    const [disabled, setDisabled] = useState(false)
    const [accountType, setAccountType] = useState('')
    const [userAccount, setUserAccount] = useState('')
    const [fields, setFIelds] = useState< Record<string, string | null | Record<string, string>>>({
      id: '',
      group:  null
    })

    const [errors, setErrors] = useState<Record<string, string | undefined>>({
        id: undefined,
        group: undefined,
        groupName: undefined
    })

    const accountTypes = {
        "Bus Rep": "ZONE",
        "Branch Head": "BRANCH",
        "Sector Head": "SECTOR"
    }

    const { data: groups, isLoading } = useBusGroups(accountType, !!accountType);
    const groupData = groups?.data?.map(item => ({label: item.name, value: item._id as string}))

    const {data: account, isLoading: accountIsLoading} = useBusAccount(
        {name: fields.id as string, group: (fields?.group as {value: string})?.value},
        Boolean(fields.id && (fields?.group as {value: string})?.value)
    )
    const userAccountData = account?.data as IBusAccount[]
    const required = ['id', 'group']
    useEffect(() => {
        const hasError = validate(required, errors, fields, setErrors)
        setDisabled(hasError)
    }, [fields])

    useEffect(() => {
        setFIelds(prev => ({...prev, group: null}))
    }, [groups])

  
    // const handleClick = () => {
    //     clearUser()
    //     const user: ILocalUser = {name: fields.id.toLowerCase(), group: fields.group, isRep: false, groupName: selected.groupName as string}

    //     const item = groups.filter((item: IBusAccount) => {
    //         return item.label === user.group
    //     })
    //     if(item.length){
    //         const itemPart = item[0]
    //         const isARep = itemPart.busReps.includes(user.name)
    //         if(isARep){
    //             user.isRep = true
    //             user.groupStations = itemPart.stations
    //             router.push(`/bus-round`)
    //         }
    //     }
    //     saveUser(
    //         user.name, 
    //         user.group, 
    //         user.isRep, 
    //         user.groupName, 
    //         user.groupStations
    //     )
    // }

    // useEffect(() => {
    //     if(fields.id && fields.group && data){
    //         const item = groups.filter(item => {
    //             return item.label === fields.group
    //         })
    //         if(item.length){
    //             const itemPart = item[0]
    //             const isARep = itemPart.busReps.includes(fields.id.toLowerCase())
    //             setShowIsRep(isARep)
    //         }
    //     }

    // }, [fields, groups])
    

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
            <FormLabel color="gray.700">Enter Account ID</FormLabel>
            <Input placeholder='Enter ID Here ' value={fields.id as string } 
            onChange={v =>   handleChange(v.currentTarget?.value, 'id', fields, setFIelds)}
            />
        </Box>
        {!accountType.length ? 
            <Box 
                mb={4} 
                bg="blue.400" 
                rounded={"sm"} 
                color="white" 
                px={4} py={3} 
                w="100%"
            >
                Select an account type to continue</Box>
            : null
        }
        <Box mb={6} fontSize={14}>
            <FormLabel color="gray.700" fontSize={17}>Select account type</FormLabel>
            <Flex justifyContent={"space-between"}>
                {Object.keys(accountTypes)?.map(item => (
                    <Flex align={"center"} gap={2} key={item}>
                        <Flex 
                            p={1} 
                            rounded={"sm"} 
                            borderWidth={1} 
                            borderColor={accountType === accountTypes[item as "Bus Rep" | "Branch Head" | "Sector Head"] ? "blue.400" :"gray.200"} 
                            w={7} h={7}
                            cursor={"pointer"}
                            onClick={() => 
                                setAccountType(accountTypes[item as "Bus Rep" | "Branch Head" | "Sector Head"])
                            }
                        >
                            <Box w={"100%"} h="100%" bg={accountType === accountTypes[item as "Bus Rep" | "Branch Head" | "Sector Head"] ? "blue.400" :"gray.300"} ></Box>
                        </Flex>
                        <Text>{item}</Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
        {accountType && <Box>
            { !isLoading ?
        (
            <Box fontSize={14}>
                <FormLabel color="gray.700">Select {accountType.toLowerCase()}</FormLabel>
                <Autocomplete 
                    value={fields['group'] as string}
                    name='group'
                    options={groupData || []}
                    fields={fields as Record<string, string>}
                    setFields={setFIelds as unknown as Dispatch<SetStateAction<Record<string, string | boolean | undefined>>>}
                    placeholder='Enter zone name here ...'
                />
            </Box>
        ) : <Skeleton w="100%" h={48} rounded={'md'}/>}
        </Box>}

        {userAccount && <Box my={4}>
            <Text fontWeight={500} fontSize={17}>Account Info</Text>
            <Flex gap={4}>
                <Box flex={1} p={2} bg={'gray.100'} rounded="md" fontSize={15}>
                    <Flex justify={"space-between"}>
                        <Text>Role</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                </Box>
                <Box flex={1} p={2} bg={'gray.100'} rounded="md" fontSize={15}>
                    <Flex justify={"space-between"}>
                        <Text>Sector</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text>Branch</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text>Zone</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>}

        {(fields['id']?.length && fields['group']) && !userAccountData?.length && !accountIsLoading ? <Box 
                mb={4} 
                bg="orange.400" 
                rounded={"sm"} 
                color="white" 
                px={4} py={3} 
                w="100%"
                mt={4}
            >
                It appears the selected account does not have access to the busing system kindly reach out to your branch head
            </Box> : null
            
        }

        {(fields['id']?.length && fields['group']) && userAccountData?.length && !accountIsLoading ?
            (
                <Flex gap={4} mt={4}>
                <Box flex={1} p={2} bg={'gray.100'} rounded="md" fontSize={15}>
                    <Flex justify={"space-between"}>
                        <Text>Role</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                </Box>
                <Box flex={1} p={2} bg={'gray.100'} rounded="md" fontSize={15}>
                    <Flex justify={"space-between"}>
                        <Text>Sector</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text>Branch</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text>Zone</Text>
                        <Text>Zone Head</Text>
                    </Flex>
                </Box>
            </Flex>
            ) 
            : null
        }
    </>
  )
}
