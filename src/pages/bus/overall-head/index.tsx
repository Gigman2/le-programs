/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { useBaseGetQuery } from '@/frontend/apis/base'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { saveBusData } from '@/frontend/store/bus'
import dayjs from 'dayjs'

export default function EventSummarySector() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()


    const {isLoading, data} = useBaseGetQuery<{ withoutStations: string[], noBusRep: string[] }>('bus-groups/group-stats', {type: 'zone'}, {type: 'zone'}, 
        !!currentUser
    )

    const {isLoading: eventsLoading, data: eventsData} = useBaseGetQuery<{ 
            id: string,
            name:string,
            start: string,
            end: string,
            timeSince: string,
            live: boolean,
            daysTo: number
        }[]>('events/previous', {}, {}, 
        !!currentUser
    )


  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)

    saveBusData('no-reps', [])
    saveBusData('selected-event', {})
  },[])

  const gotoGroupsWithoutRep = (key: string, data: Record<string, any>) => {
    router.push('/bus/overall-head/group-stats/without-reps')
    saveBusData(key, data)
  }

  const gotoEvents = (key: string, data: Record<string, any>) => {
    router.push('/bus/overall-head/event')
    saveBusData(key, data)
  }

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Box mt={12}>
            <Text fontWeight={600} color={"gray.500"}>Events</Text>
            {eventsLoading ? <Skeleton h={16} rounded={"md"} w={"100%"} mb={4} /> : null}
            {eventsData?.data.map(item => (
                <Box key={item.id} borderColor={"gray.100"} borderWidth={1} rounded={"md"} p={4} mb={4}  bg={"gray.100"} cursor={"pointer"} 
                    onClick={() => gotoEvents('selected-event', item)}
                >
                    <Flex justify={"space-between"} align={"center"} borderBottomWidth={1} borderColor={"gray.200"} pb={1}>
                        <Flex align={"center"} gap={2}>
                            <Text color={"gray.500"} fontWeight={600}>{item.name}</Text>
                        </Flex>
                        {item.daysTo < 0 ? <Flex align={"center"} gap={2}>
                            <Box rounded={"full"} boxSize={3} bg="yellow.400"></Box>
                            <Text color={"gray.500"}>{item.timeSince}</Text>
                        </Flex>: item.daysTo > 0 ? 
                            <Flex align={"center"} gap={1}>
                                <Box rounded={"full"} boxSize={3} bg="red.400"></Box>
                                <Text color={"gray.500"}>{item.timeSince}</Text>
                            </Flex> : 
                            <Flex align={"center"} gap={1}>
                                <Text color={"gray.500"}>Active</Text>
                                <Box rounded={"full"} boxSize={3} bg="green.500"></Box>
                            </Flex>
                        }
                    </Flex>
                    <Flex color={"gray.500"} justify={"space-between"}>
                        <Text fontSize={14}><Text as="span"  fontWeight={600}>Start</Text> {dayjs(item.start).format('D MMM YYYY hh:mm a')}</Text>
                        <Text fontSize={14}><Text as="span"  fontWeight={600}>End</Text> {dayjs(item.end).format('D MMM YYYY hh:mm a')}</Text>
                    </Flex>
                </Box>
            ))}
        </Box>

        {isLoading ? <Skeleton h={16} w="100%" rounded={"md"} /> : null}

        {data?.data.noBusRep.length ||  data?.data.withoutStations.length ? <Box mt={4}>
            <Flex my={2} gap={1}>
                <Text fontWeight={600} color={"red.400"}>Needs Your Attention</Text>
                <Text fontWeight={600} color={"red.400"} fontSize={16}>!!</Text>
            </Flex>
            {data?.data.noBusRep.length ? 
                <Box rounded={"md"} bg={"red.100"} mb={2} borderWidth={2} borderColor={"red.200"}>
                    <Box color={"red.400"} p={2}>{data.data.noBusRep.length} Zones don&apos;t have a bus rep</Box> 
                    <Box color={"red.300"} fontSize={14} 
                        p={2} bg={"whiteAlpha.700"} 
                    cursor={"pointer"} onClick={() => gotoGroupsWithoutRep('no-reps', data?.data?.noBusRep || [])}>Click here to view more</Box>
                </Box>
            : null}
            {data?.data.withoutStations.length ? 
                <Box rounded={"md"} bg={"red.100"} mb={2} borderWidth={2} borderColor={"red.200"}>
                    <Box color={"red.400"} p={2}>{data.data.withoutStations.length} 12 zones don&apos;t have a recorded station</Box> 
                    <Box color={"red.300"} fontSize={14} p={2} bg={"whiteAlpha.700"} cursor={"pointer"}>Click here to view more</Box>
                </Box>
            : null}
        </Box> : null}
      </AppWrapper>
    </GuardWrapper>
  )
}
