/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Divider, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { BsPersonFillAdd } from 'react-icons/bs'
import { MdAddBusiness } from 'react-icons/md'
import { TbAlignRight, TbHistory, TbLayoutBottombarCollapseFilled, TbPlus, TbPower, TbUsersGroup, TbX } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useActiveEvent, useBusGroupTree } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'

export default function OverallhHead() {
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
          <Flex gap={3}>
            <Box bg="gray.100" p={4} rounded={"md"} flex={7}>
              <Text color={"gray.400"}>Zones</Text>
              <hr />
              <Flex align={"baseline"} color={"gray.500"} gap={2}>
                <Text fontSize={32} fontWeight={600}>265</Text>
                <Text>zones bused</Text>
              </Flex>
              <Flex align={"baseline"} color={"gray.400"} gap={2}>
                <Text fontWeight={700}>48</Text>
                <Text>zones have not bused</Text>
              </Flex>
            </Box>
            <Box bg="blue.100" p={4} rounded={"md"} flex={6}>
                <Box borderColor={"blue.200"} borderBottomWidth={1} color={"blue.400"}>Bus</Box>
                <Flex align={"baseline"} color={"blue.500"} gap={2}>
                <Text fontSize={32} fontWeight={600}>391</Text>
                  <Text>on route</Text>
                </Flex>
                <Flex align={"baseline"} color={"blue.400"} gap={2}>
                <Text fontWeight={700}>48</Text>
                <Text>buses have arrived</Text>
              </Flex>
            </Box>
          </Flex>
          <Flex gap={3} mt={3}>
            <Box bg="blue.100" p={4} rounded={"md"} flex={6}>
                <Box borderColor={"blue.200"} borderBottomWidth={1} color={"blue.400"}>People</Box>
                <Flex align={"baseline"} color={"blue.500"} gap={2}>
                <Text fontSize={32} fontWeight={600}>1234</Text>
                  <Text>on route</Text>
                </Flex>
                <Flex align={"baseline"} color={"blue.400"} gap={2}>
                <Text fontWeight={700}>515</Text>
                <Text>people have arrived</Text>
              </Flex>
            </Box>
            <Box bg="gray.100" p={4} rounded={"md"} flex={7}>
              <Text color={"gray.400"}>Financial</Text>
              <hr />
              <Flex align={"baseline"} color={"gray.500"} gap={2}>
                <Text fontWeight={600}>Ghc </Text>
                <Text fontSize={28} fontWeight={600}>2265</Text>
                <Text>bus offering</Text>
              </Flex>
              <Flex align={"baseline"} color={"gray.400"} gap={2}>
                <Text fontWeight={700}>Ghc 20000</Text>
                <Text>busing cost</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        
        <Flex rounded={"md"} mt={4} p={4} bg="yellow.100" gap={4} align={"center"}>
          <Text fontWeight={600} color={"yellow.600"} fontSize={24}>21%</Text>
          <Box>
            <Text color={"yellow.500"}>had more than 15 people in bus</Text>
            <Divider />
            <Text color={"yellow.500"}>237 / 451 buses</Text>
          </Box>
        </Flex>
      </AppWrapper>
    </GuardWrapper>
  )
}
