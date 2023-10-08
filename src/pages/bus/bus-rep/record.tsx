/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Box, Button, Flex, FormLabel, Icon, Input, Text, useToast } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbChevronLeft} from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { handleChange, validate } from '@/utils/form'
import { CreateBusTrip, CreateBusTripDTO } from '@/frontend/apis/bus'
import { IEvent } from '@/interface/events'
import { getActiveEvent } from '@/frontend/store/event'
import dayjs from 'dayjs'
import AppWrapper from '@/frontend/components/layouts/appWrapper'

export default function AddBusLog() {
    const [currentUser, setCurrentUser] = useState<IAccountUser>()
    const [activeEvent, setActiveEvent]  = useState<IEvent>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const toast = useToast()
    const [fields, setFields] = useState({
        busOffering: 0,
        people: 0,
        busCost: 0,
        vehicle: ""
    })

    const createBus = async () => {
        try {
            setLoading(true)
            const payload: CreateBusTripDTO = { 
                busOffering: fields.busOffering, 
                people: fields.people, 
                busCost: fields.busCost
            }
            const eventStart = activeEvent?.occurrence === 'FIXED' ? dayjs(activeEvent.duration?.start).format('YYYY-MM-DDTHH:mm') : dayjs().startOf('day').format('YYYY-MM-DDTHH:mm')
            const eventEnd = activeEvent?.occurrence === 'FIXED' ? dayjs(activeEvent.duration?.end).format('YYYY-MM-DDTHH:mm') : dayjs().endOf('day').format('YYYY-MM-DDTHH:mm')
            const eventKey = `${activeEvent?._id}_${eventStart}_${eventEnd}_${activeEvent?.meetingType}`
            
            payload.tag = eventKey
            payload.recordedBy = currentUser?.accountId
            payload.busZone = currentUser?.bus?.['ZONE']?.id as string
            payload.event = activeEvent?._id as string
            payload.busState = "EN_ROUTE"
            payload.vehicle = (fields.vehicle as unknown as any).value

            const res: any = await CreateBusTrip(payload)
            if(res){
                toast({
                    status: "success",
                    duration: 2000,
                    position: 'top-right',
                    isClosable: true, 
                    title: "Bus trip recorded"
                })
                router.back()
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            const _error = error as any
            toast({
                status: "error",
                duration: 2000,
                position: 'top-right',
                isClosable: true, 
                title: _error?.response?.data?.error || _error.message || 'Error occurred'
            })
        }
    }


    useEffect(() => {
        const user = getUser() as IAccountUser
        setCurrentUser(user)

        const event = getActiveEvent()
        if(event) setActiveEvent(event)
    },[])

  return (
    <GuardWrapper allowed={['BUS_REP']} redirectTo='/bus/login' app='bus'>
      <AppWrapper hideInfo={true}>
        <Flex gap={4}>
            <Flex px={3} py={4} align={"center"} rounded={"md"} bg="gray.200" h={14} cursor={"pointer"}
                onClick={() => router.back()}
            >
                <Icon as={TbChevronLeft} fontSize={32} color={"gray.500"} />
            </Flex>
            <Box textAlign={"center"} p={4} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
                Creating a new bus trip
            </Box>
        </Flex>
        <Flex justify={"space-between"} mt={2}>
            <Box>
                <Text color={"gray.500"} lineHeight={1.2}>Event</Text>
                <Text fontWeight={600} color={"gray.600"}>{activeEvent?.name}</Text>
            </Box>

            <Box textAlign={"right"}>
                <Text color={"gray.500"} lineHeight={1.2}>Current time is</Text>
                <Text fontWeight={600} color={"gray.600"}>{dayjs().format('h:mm A')}</Text>
            </Box>
        </Flex>

        <Box mt={4}>
            {!fields.busCost ? <Box p={4} bg="orange.300" color={"white"} mb={4} rounded={"md"}>
                Bus logs can&apos;t be created without a bus cost
            </Box> : null}
            <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                <FormLabel fontSize={14}>What is the cost of the bus fare?</FormLabel>
                <Input 
                    type={"text"}
                    name="busCost"
                    placeholder='Enter here ...' 
                    value={fields.busCost} 
                    onChange={(v) => handleChange(v?.currentTarget?.value, 'busCost', fields, setFields)} 
                />
            </Box>

            <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                <FormLabel fontSize={14}>How many people do you have in the bus</FormLabel>
                <Input 
                    type={"text"}
                    name="people"
                    placeholder='Enter here ...' 
                    value={fields.people} 
                    onChange={(v) => handleChange(v?.currentTarget?.value, 'people', fields, setFields)} 
                />
            </Box>

            <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                <FormLabel fontSize={14}>How much offering were you able to collect</FormLabel>
                <Input 
                    type={"text"}
                    name="busOffering"
                    placeholder='Enter here ...' 
                    value={fields.busOffering} 
                    onChange={(v) => handleChange(v?.currentTarget?.value, 'busOffering', fields, setFields)} 
                />
            </Box>

            {/* <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                <FormLabel fontSize={14}>Indicate the vehicle used for the trip</FormLabel>
                <Autocomplete
                    name='vehicle'
                    options={vehicleList?.map(a => ({label:a.name, value: a._id as string})) || []}
                    value={fields['vehicle']}
                    fields={fields as unknown as Record<string, string>}
                    setFields={setFields as unknown as React.Dispatch<React.SetStateAction<Record<string, string | boolean | undefined >>>}
                    placeholder='Select vehicle'

                />
                
            </Box> */}

            <Box as={Button} 
                width="full" 
                mt={8} 
                mb={4}
                bg="base.blue" 
                color="white" 
                _hover={{bg: "base.blue"}}
                _focus={{bg: "base.blue"}}
                _active={{bg: "base.blue"}}
                isLoading={loading}
                isDisabled={loading || !fields.busCost}
                onClick={(v) => createBus()} 
                >Create
            </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
