/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Button, Flex, Icon, Skeleton, Text, useDisclosure } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbAlignRight, TbHistory, TbPlus, TbPower } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useActiveEvent, useBusGroupTree, useBusTrips } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import { IBusRound } from '@/interface/bus'
import BusCard from '@/frontend/components/Bus/BusCard'
import RecordCheckPoint from '@/frontend/components/Modals/recordCheckPoint'
import EndBusTrip from '@/frontend/components/Modals/endBusTrip'
import AppWrapper from '@/frontend/components/layouts/appWrapper'

const MenuOptions = [
  {title: "History", icon: TbHistory, fn: null},
  {title: "Logout", icon: TbPower, fn: removeSession}

]

export default function BusRepLogs() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: endIsOpen, onOpen: endOnOpen, onClose: endOnClose } = useDisclosure()

  const [selectedRecord, setSelectedRecord]= useState<IBusRound>()

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )

  const {isLoading: busTripLoading, data: busTripData} = useBusTrips(
    {
      event: eventData?.data?._id as string,
      zone: currentUser?.bus['ZONE']?.id as string
    },
    {
      event: eventData?.data?._id as string,
      zone: currentUser?.bus['ZONE']?.id as string,
      isOpen,
      endIsOpen
    },
    !!(eventData?.data?._id && currentUser?.bus['ZONE']?.id)
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
    <GuardWrapper allowed={['BUS_REP']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
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
              <RecordCheckPoint isOpen={isOpen} onClose={onClose} selectedRecord={selectedRecord as IBusRound}/>
              <EndBusTrip isOpen={endIsOpen} onClose={endOnClose} selectedRecord={selectedRecord as IBusRound}/>

              <Box left={0} pos={"absolute"} h={"100%"} w={2} rounded={"full"} bg="gray"></Box>
              {busTripLoading ? 
                <Skeleton h={20} w="100%" rounded={"md"} /> : 
                <>{busTripData?.data.map((item, i) => (
                <BusCard 
                    key={item._id} 
                    index={i} 
                    item={item} 
                    ended={item.busState === 'ARRIVED'}
                    openCheckin={ onOpen}
                    openEndTrip={ endOnOpen}
                    myLog={(item.recordedBy as unknown as {_id: string})?._id === currentUser?.accountId}
                    setSelectedRecord={setSelectedRecord}
                  />
                ))}</>
              }
            </Box>
          </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}

