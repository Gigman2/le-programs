/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { useActiveEvent, useBaseGetQuery } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { saveBusData } from '@/frontend/store/bus'

export default function EventSummarySector() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupType
  )

    const {isLoading, data, error} = useBaseGetQuery<{ withoutStations: string[], noBusRep: string[] }>('bus-groups/group-stats', {type: 'zone'}, {type: 'zone'}, 
    !!currentUser
  )


  useEffect(() => {
    if(eventData && !eventError){
      saveActiveEvent(eventData?.data)
    }
  },[eventData, eventError])

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)

    console.log('Removing data ')
    // saveBusData('no-reps', [])
  },[])

  const gotoGroupsWithoutRep = (key: string, data: Record<string, any>) => {
    router.push('/bus/overall-head/group-stats/without-reps')
    saveBusData(key, data)
  }

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Box mt={12}>
            <Text fontWeight={600} color={"gray.500"}>Events</Text>
            <Box borderColor={"gray.100"} borderWidth={1} rounded={"md"} p={4} mb={4}  bg={"gray.100"}>
                <Flex justify={"space-between"} align={"center"} borderBottomWidth={1} borderColor={"gray.200"} pb={1}>
                    <Flex align={"center"} gap={2}>
                        <Text color={"gray.500"} fontWeight={600}>Mega gathering service</Text>
                    </Flex>
                    <Flex align={"center"} gap={1}>
                        <Text color={"gray.500"}>active</Text>
                        <Box rounded={"full"} boxSize={3} bg="green.400"></Box>
                    </Flex>
                </Flex>
                <Box pt={1}>
                    <Flex color={"gray.500"} justify={"space-between"}>
                        <Box>
                            <Box my={1} bg="yellow.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>In route</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>12</Text> People</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>4</Text> Buses</Text>
                        </Box>
                        <Box>
                            <Box my={1} bg="blue.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>Arrived</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>12</Text> People</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>4</Text> Buses</Text>
                        </Box>
                        <Box>
                            <Box my={1} bg="green.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>Finance</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>Ghc 2000</Text> Offering</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>Ghc 3000</Text> Bus Cost</Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
            <Box borderColor={"gray.100"} borderWidth={1} rounded={"md"} p={4} mb={2} bg={"gray.100"}>
                <Flex borderBottomWidth={1} borderColor={"gray.200"} pb={1} justifyContent={"space-between"}>
                    <Flex align={"center"} gap={2}>
                        <Text color={"gray.500"} fontWeight={600}>Mega gathering service</Text>
                    </Flex>
                    <Text color={"gray.400"} fontSize={14}>7 Days ago</Text>
                </Flex>
                <Box pt={1}>
                    <Flex color={"gray.500"} justify={"space-between"}>
                        <Box>
                            <Box my={1} bg="yellow.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>In route</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>12</Text> People</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>4</Text> Buses</Text>
                        </Box>
                        <Box>
                            <Box my={1} bg="blue.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>Arrived</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>12</Text> People</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>4</Text> Buses</Text>
                        </Box>
                        <Box>
                            <Box my={1} bg="green.300" textAlign="center" color={"white"} fontSize={14} rounded={"full"}>Finance</Box>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>Ghc 2000</Text> Offering</Text>
                            <Text fontSize={14}><Text as="span"  fontWeight={600}>Ghc 3000</Text> Bus Cost</Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
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
