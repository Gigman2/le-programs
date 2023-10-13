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
import { getSpecificBusData } from '@/frontend/store/bus'

interface IEventData { 
      id: string,
      name:string,
      start: string,
      end: string,
      timeSince: string,
      live: boolean
  }

export default function OverallhHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
    const [extraData, setExtraData] = useState<IEventData>()

  const router = useRouter()


  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)

    const list = getSpecificBusData<IEventData>('selected-event')
    setExtraData(list)
  },[])

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Flex mt={4} align={"center"} justify={"space-between"}>
             <Text fontWeight={600} color="gray.500"> {extraData?.name}</Text>
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
        
        
        <Box rounded={"md"} mt={4} py={2} px={4} bg="yellow.100">
          <Text  color={"yellow.400"}>Percent with more than half full</Text>
          <Flex borderColor={"yellow.200"} borderTopWidth={1} gap={4} align={"center"}>
            <Text fontWeight={600} color={"yellow.600"} fontSize={28}>21%</Text>
            <Box>
              <Text color={"yellow.500"} py={1}>had more than 15 people in bus</Text>
              <Text color={"yellow.400"}>237 / 451 buses</Text>
            </Box>
          </Flex>
        </Box>

        <Box mt={6}>
          <Text color={"gray.500"} fontWeight={600} fontSize={20} >Sectors</Text>
          <Box rounded={"md"} borderWidth={1} bg={"gray.100"} p={4} mb={4}>
            <Flex justify={"space-between"}>
              <Text color={"gray.500"}>Accra North Sector</Text>
              <Text color={"gray.500"}><Text as={"span"} fontWeight={600}>12</Text> Buses</Text>
            </Flex>
            <Flex gap={2} wrap={"wrap"} mt={1}>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>La</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Lashibi</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>

            </Flex>
            <Flex justify={"space-between"} mt={2} color={"gray.500"}>
              <Text>Ghc 2000 offering</Text>
              <Text>Ghc 2000 bus cost</Text>
            </Flex>
          </Box>
          <Box rounded={"md"} borderWidth={1} bg={"gray.100"} p={4} mb={4}>
            <Flex justify={"space-between"}>
              <Text color={"gray.500"}>Accra North Sector</Text>
              <Text color={"gray.500"}><Text as={"span"} fontWeight={600}>12</Text> Buses</Text>
            </Flex>
            <Flex gap={2} wrap={"wrap"} mt={1}>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>La</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Lashibi</Box>
              <Box bg={"blue.300"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>
              <Box bg={"gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>Teshie</Box>

            </Flex>
            <Flex justify={"space-between"} mt={2} color={"gray.500"}>
              <Text>Ghc 2000 offering</Text>
              <Text>Ghc 2000 bus cost</Text>
            </Flex>
          </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
