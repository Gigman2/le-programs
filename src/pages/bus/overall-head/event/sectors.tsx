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
        <Flex mt={4} align={"center"} justify={"space-between"}>
            {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data?.name}</Text> : <Skeleton h={6} w={"200px"} />}
        </Flex>

        <Box mt={4}>
          <Flex gap={2} color={"gray.500"}>
            <Text color={"gray.400"}>For the event</Text>
            <Text fontWeight={600}>Mega Gathering Service</Text>
          </Flex>
          <Text fontWeight={600} color={"gray.500"} fontSize={20}>Summary</Text>
          <Box p={3} bg="gray.100" rounded={"md"}>
            <Flex gap={2}>
              <Box bg="blue.100" p={3} rounded={"md"} my={1} flex={1}>
                <Text color={"blue.400"}>Bus in route<Text as="span" ml={2} fontWeight={600}>Ghc 470</Text></Text>
                <Text color={"blue.400"}>Bus arrived <Text as="span" fontWeight={600}>Ghc 470</Text></Text>
              </Box>
              <Box bg="blue.100" p={3} rounded={"md"} my={1} flex={1}>
                <Text color={"blue.400"}>People in route<Text as="span" ml={2} fontWeight={600}>Ghc 470</Text></Text>
                <Text color={"blue.400"}>People arrived <Text as="span" fontWeight={600}>Ghc 470</Text></Text>
              </Box>
            </Flex>
            <Box bg="green.100" p={3} rounded={"md"} my={1}>
              <Text color={"green.400"}>Bus offering received<Text as="span" ml={2} fontWeight={600}>Ghc 470</Text></Text>
              <Text color={"green.400"}>Actual cost of bus <Text as="span" fontWeight={600}>Ghc 470</Text></Text>
            </Box>
          </Box>
        </Box>

        <Box mt={6}>
          <Text color={"gray.500"} fontWeight={600} fontSize={20} >Branches</Text>
          <Box rounded={"md"} borderWidth={1} bg={"gray.100"} p={4} mb={4}>
            <Flex justify={"space-between"}>
              <Text color={"gray.500"}>Thesaurus</Text>
              <Text color={"gray.500"}><Text as={"span"} fontWeight={600}>12</Text> Buses</Text>
            </Flex>
            <Flex gap={2} wrap={"wrap"} mt={1}>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Zone 1</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>KFC</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Mall</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>East Legon</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>East Legon 2</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>UPSA</Box>
            </Flex>
            <Flex justify={"space-between"} borderTopWidth={1} borderBottomWidth={1} borderColor={"gray.300"} mt={2} mb={4} py={3}>
              <Box>
                <Text fontWeight={600} fontSize={14} color={"gray.400"}>Bus Activity</Text>
                <Box mt={1} color={"gray.600"}>
                  <Flex gap={2} >
                    <Text>Arrived</Text>
                    <Text fontWeight={600}>12</Text>
                  </Flex>
                  <Flex gap={2}>
                    <Text>In Route</Text>
                    <Text fontWeight={600}>12</Text>
                  </Flex>
                </Box>
              </Box>
              <Box>
                <Text fontWeight={600} fontSize={14} color={"gray.400"}>People Transported</Text>
                <Box mt={1} color={"gray.600"}>
                  <Flex gap={2} >
                    <Text>Arrived</Text>
                    <Text fontWeight={600}>12</Text>
                  </Flex>
                  <Flex gap={2}>
                    <Text>In Route</Text>
                    <Text fontWeight={600}>12</Text>
                  </Flex>
                </Box>
              </Box>
            </Flex>
            <Flex justify={"space-between"} mt={2} color={"gray.500"}>
              <Text>Ghc <Text as={"span"} fontWeight={600}>2000</Text> offering</Text>
              <Text>Ghc <Text as={"span"} fontWeight={600}>2000</Text> bus cost</Text>
            </Flex>
          </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
