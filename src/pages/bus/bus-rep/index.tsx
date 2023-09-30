/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Button, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbAlignRight, TbCheck, TbMapPinPlus, TbHistory, TbPlus, TbPower } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useActiveEvent, useBusGroupTree, useBusTrips } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import { IBusRound } from '@/interface/bus'
import dayjs from 'dayjs'
import BusCard from '@/frontend/components/Bus/BusCard'
const MenuOptions = [
  {title: "History", icon: TbHistory, fn: null},
  {title: "Logout", icon: TbPower, fn: removeSession}

]

export default function BusRepLogs() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const {isLoading, data: groupTree} = useBusGroupTree(currentUser?.currentRole?.groupId as string, 
    !!(currentUser?.currentRole?.groupType === "BUS_REP")
  )

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )

  const {isLoading: busTripLoading, data: busTripData} = useBusTrips(
    {
      event: eventData?.data?._id as string,
      zone: currentUser?.bus['ZONE']?.id as string
    }, 
    !!(eventData?.data?._id && currentUser?.bus['ZONE']?.id)
  )

  useEffect(() => {
    if(groupTree?.data.length){
          const busTreeData = groupTree?.data
          const bus = busTreeData.reduce((acc: GroupedUnits, cValue) => {
            if(cValue){
              acc[cValue.type] = {
                  id: cValue._id,
                  name: cValue.name
              }
            }
            return acc
          }, {})
          const account = currentUser as IAccountUser

          saveBusUser({...account, bus})
          setCurrentUser({...account, bus})
    }
  }, [groupTree])


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
    <GuardWrapper allowed={['BUS_REP']} redirectTo='/bus/login' app='bus'>
      <PageWrapper>
        <Box maxW={"500px"} w="100%" h={"100vh"} position={"relative"}>
          <Menu options={MenuOptions} show={showMenu} setShow={setShowMenu} />
          <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2} mt={4} rounded={"md"}>
              <Box>
                {!isLoading && (currentUser?.bus?.['BRANCH'] || currentUser?.bus?.['ZONE']) &&  <Flex fontWeight={600} color={"gray.600"}>
                  <Text color={"gray.500"}>{`${currentUser?.bus?.['BRANCH']?.name}, ${currentUser?.bus?.['ZONE']?.name}`}</Text>
                </Flex>}
                <Text fontWeight={600} fontSize={14} color="gray.400" textTransform={"capitalize"}>Hello {currentUser?.name}!</Text>
              </Box>
              <Flex onClick={() => setShowMenu(true)}>
                <Icon as={TbAlignRight} color="gray.600" fontSize={28} mr={3} />
              </Flex>
          </Flex>

          <Flex mt={4} align={"center"} justify={"space-between"}>
            {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data?.name}</Text> : <Skeleton h={6} w={"200px"} />}
            {!eventLoading ? (
              <Flex 
                as={Button}
                cursor="pointer" align={"center"} 
                bg="gray.600" gap={2} color={"white"} 
                py={2} px={4} rounded={"md"} 
                isDisabled={eventError as boolean}
                onClick={() => router.push('/bus/bus-rep/record')}
              >
                <Icon as={TbPlus} fontSize={20} />
                Record Busing
              </Flex>
            ) : <Skeleton h={12} w="150px" rounded={"md"} />}
          </Flex>

          <Box mt={4}>
            <Box pos={"relative"} pl={4}>
              <Box left={0} pos={"absolute"} h={"100%"} w={2} rounded={"full"} bg="gray"></Box>
              {busTripLoading ? 
                <Skeleton h={20} w="100%" rounded={"md"} /> : 
                <>{busTripData?.data.map((item, i) => (<BusCard 
                    key={item._id} 
                    index={i} 
                    item={item} 
                    ended={item.busState === 'ARRIVED'}
                    myLog={(item.recordedBy as unknown as {_id: string})?._id === currentUser?.accountId}
                  />))}</>
              }
            </Box>
          </Box>
        </Box>
      </PageWrapper>
    </GuardWrapper>
  )
}
