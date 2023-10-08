/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import {  TbLayoutBottombarCollapseFilled, TbPower, TbUsersGroup, TbX } from 'react-icons/tb'
import { useActiveEvent } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'



export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
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
    <GuardWrapper allowed={['BUS_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Flex mt={4} align={"center"} justify={"space-between"}>
          {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data?.name}</Text> : <Skeleton h={6} w={"200px"} />}
        </Flex>

        <Flex gap={3} mt={4}>
          <Box justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="gray.100" borderWidth={1} 
                borderColor={"gray.200"}
          >
            <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} fontWeight={600} color={"gray.500"}>Bus Started </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>24</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus in route </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus arrived </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>
          </Box>

          <Box justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="gray.100" borderWidth={1} 
                borderColor={"gray.200"}
          >
            <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} fontWeight={600} color={"gray.500"}>People Transported  </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>24</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>People in route </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>People arrived </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>
          </Box>
        </Flex>

        <Box justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="gray.100" borderWidth={1} 
                borderColor={"gray.200"} mt={3}
          >
            <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} fontWeight={600} color={"gray.500"}>Finance Summary </Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus Cost Accrued</Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus Offering Received </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>3</Text>
            </Flex>
        </Box>

        <Flex gap={3}>
          <Flex justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="red.100" borderWidth={1} 
                borderColor={"red.200"} mt={3}
          >
            <Text fontSize={15} fontWeight={600} color={"red.400"}>Bus not started</Text>
            <Text fontSize={15} fontWeight={600} color={"red.400"}>3</Text>
          </Flex>
          <Flex justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="orange.100" borderWidth={1} 
                borderColor={"orange.200"} mt={3}
          >
            <Text fontSize={15} fontWeight={600} color={"orange.400"}>Target not met</Text>
            <Text fontSize={15} fontWeight={600} color={"orange.400"}>3</Text>
          </Flex>
        </Flex>
      </AppWrapper>
    </GuardWrapper>
  )
}
