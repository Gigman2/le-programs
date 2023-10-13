/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { useActiveEvent } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'

export default function EventSummarySector() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupType
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
  },[])

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

       <Box mt={4}>
             <Flex my={2} gap={1}>
                <Text fontWeight={600} color={"gray.500"}>Alerts</Text>
                <Text fontWeight={600} color={"red.400"} fontSize={16}>!!</Text>
            </Flex>
            <Box rounded={"md"} p={2} mb={2} color={"red.400"} bg={"red.100"}>12 Zones don&apos;t have a bus rep</Box>
            <Box rounded={"md"} p={2} mb={2} color={"red.400"} bg={"red.100"}>3 Zones don&apos;t have a any record stations</Box>
            <Box rounded={"md"} p={2} mb={2} color={"red.400"} bg={"red.100"}>3 Account holders haven&apos;t logged in</Box>

       </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
