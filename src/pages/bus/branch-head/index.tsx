/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbAlignRight, TbHistory, TbPlus, TbPower, TbX } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useActiveEvent, useBusGroupTree } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
const MenuOptions = [
  {title: "History", icon: TbHistory, fn: null},
  {title: "Logout", icon: TbPower, fn: removeSession}

]


const CardItem = ({name, value, myLog}: {name: string; value: string, myLog: boolean}) => {
  return (
    <Flex align={"center"} gap={3}>
      <Text fontSize={13} color={myLog ? "whiteAlpha.800" : "gray.600"}>{name}</Text>
      <Text fontSize={14} fontWeight={600} color={myLog ? "white" : "blackAlpha.700"}>{value}</Text>
    </Flex>
  )
}

const cardData = [
  [
    {name: "Started by", value: "Alex Ferguson"},
    {name: "Started on", value: "9:00 am"}
  ],
  [
    {name: "No of people", value: "98"},
    {name: "Ended on", value: "11:00 am"}
  ],
  [
    {name: "Offering Received", value: "Ghc 98"},
    {name: "Actual Cost", value: "Ghc 205"}
  ]
]

const BusCard = ({time, ended, myLog}: {time: string; ended: boolean; myLog?: boolean}) => {
  return (
    <Box mb={8}>
        <Text fontSize={13} color={"gray.600"}>{time}</Text>
        <Box bg={myLog ? "black" : "gray.100"} p={3} borderColor={myLog ? "black" :"gray.200"} borderWidth={1} rounded={"md"}>
          <Flex justify={"space-between"} mb={2}>
            <Text color={myLog ? "white" : "blackAlpha.700"} fontSize={13}>
              <Text as="span" fontWeight={600}>Bus 1</Text> | Currently at 
              <Text as="span" fontWeight={600} fontSize={14}> Oyarifa</Text>
            </Text>

            {myLog ? <Box 
              bg={ended ? "transparent" : "white"} 
              color={ended ? "white" : "black"} 
              px={4} rounded={"md"}
              {...(ended && myLog) ? {fontWeight: 600} : {}}
              borderColor={"gray.500"}
            >
              {ended ? 'Arrived' : "Update Trip"}
            </Box> : <Box 
              bg={"transparent"} 
              color={ended ? "green.400" : "blue.500"} 
              px={4} rounded={"md"}
              borderColor={"gray.500"}
              fontWeight={600}
            >
              {ended ? 'Arrived' : "En-Route"}
            </Box>}
          </Flex>
          <Box w={"100%"} h={"1px"} bg="gray.300" />
          {cardData.map((item, i) => (
            <Flex key={`${i}`} mt={1} justify={"space-between"}>
              {item.map(
                card => (
                  <CardItem key={`${i}-${card.name}`} name={card.name} value={card.value} myLog={!!myLog} />
              ))}
            </Flex>
          ))}
        </Box>
    </Box>
  )}

export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const {isLoading, data: groupTree} = useBusGroupTree(currentUser?.currentRole?.groupId as string, 
    !!(currentUser?.currentRole?.groupType === "BUS_REP")
  )

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )

  useEffect(() => {
    if(groupTree?.data.length){
          const busTreeData = groupTree?.data
          console.log('Bus ', busTreeData)
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
        <Box maxW={"500px"} w="100%" position={"relative"}>
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
            {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data.name}</Text> : <Skeleton h={6} w={"200px"} />}
            {!eventLoading ? <Flex cursor="pointer" align={"center"} bg="gray.600" gap={2} color={"white"} py={2} px={4} rounded={"md"} onClick={() => router.push('/bus/bus-rep/record')}>
              <Icon as={TbPlus} fontSize={20} />
              Record Busing
            </Flex> : <Skeleton h={12} w="150px" rounded={"md"} />}
          </Flex>

          <Box mt={4}>
            <Box pos={"relative"} pl={4}>
              <Box left={0} pos={"absolute"} h={"100%"} w={2} rounded={"full"} bg="gray"></Box>
              <BusCard time={"Sun 1, October 9:31 AM"} ended={true} />
              <BusCard time={"Sun 14, October 10:01 AM"} ended={true}  myLog={true}/>
              <BusCard time={"Sun 14, October 10:01 AM"} ended={false} />
              <BusCard time={"Sun 14, October 10:01 AM"} ended={false}  myLog={true}/>
            </Box>
          </Box>
        </Box>
      </PageWrapper>
    </GuardWrapper>
  )
}
