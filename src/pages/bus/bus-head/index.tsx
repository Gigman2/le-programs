/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Skeleton, Text, useDisclosure } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { useActiveEvent, useEventZoneSummary } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import ZoneCard from '@/frontend/components/Bus/ZoneCard'
import { IBusRound } from '@/interface/bus'
import DeleteBusRound from '@/frontend/components/Modals/deleteBusRound'
import { saveExtraBusRecord } from '@/frontend/store/bus'



export default function BranchHead() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [selectedBus, setSelectedBus] = useState<IBusRound>()
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()

  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )

  const {isLoading, data, error} = useEventZoneSummary(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )


  useEffect(() => {
    if(eventData && !eventError){
      saveActiveEvent(eventData?.data)
    }
  },[eventData, eventError])

  useEffect(() => {
    const payload = {
      notStarted: data?.data.notStarted as string[],
      unMetTarget: data?.data.unMetTarget as string[]
    }
    saveExtraBusRecord(payload)
  }, [data?.data.unMetTarget, data?.data.notStarted])

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
   saveExtraBusRecord({})
  },[])

  return (
    <GuardWrapper allowed={['BUS_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Flex mt={4} align={"center"} justify={"space-between"}>
          {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data?.name}</Text> : <Skeleton h={6} w={"200px"} />}
        </Flex>

        <Box maxH={'calc(100vh - 150px)'} overflowY={'scroll'}>
          <Flex gap={3} mt={4}>
          {isLoading ? <Skeleton h={24} w="100%" rounded={"md"} /> : (
            <Box justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="gray.100" borderWidth={1} 
                borderColor={"gray.200"}
          >
            <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} fontWeight={600} color={"gray.500"}>Bus Started </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data?.busInfo?.total_buses || 0}</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus in route </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data?.busInfo?.on_route || 0}</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>Bus arrived </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data.busInfo?.arrived || 0}</Text>
            </Flex>
            </Box>
          )}

          {isLoading ? <Skeleton h={24} w="100%" rounded={"md"} /> : (
            <Box justifyContent={"space-between"} 
                flex={1} p={2} rounded={"md"} 
                bg="gray.100" borderWidth={1} 
                borderColor={"gray.200"}
          >
            <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} fontWeight={600} color={"gray.500"}>People Transported  </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data?.peopleInfo?.people || 0}</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>People in route </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data?.peopleInfo?.on_route || 0}</Text>
            </Flex>

            <Flex mt={1} w="100%" justifyContent={"space-between"}>
              <Text fontSize={15} color={"gray.500"}>People arrived </Text>
              <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>{data?.data?.peopleInfo?.arrived}</Text>
            </Flex>
            </Box>
            )}
          </Flex>

          {isLoading ? <Skeleton mt={3}  h={24} w="100%" rounded={"md"}  /> : (<Box justifyContent={"space-between"} 
                  flex={1} p={2} rounded={"md"} 
                  bg="gray.100" borderWidth={1} 
                  borderColor={"gray.200"} mt={3}
            >
              <Flex borderBottomWidth={1} borderColor={"gray.200"} w="100%" justifyContent={"space-between"}>
                <Text fontSize={15} fontWeight={600} color={"gray.500"}>Finance Summary </Text>
              </Flex>

              <Flex mt={1} w="100%" justifyContent={"space-between"}>
                <Text fontSize={15} color={"gray.500"}>Bus Cost Accrued</Text>
                <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>Ghc {data?.data?.financeInfo?.cost || 0}</Text>
              </Flex>

              <Flex mt={1} w="100%" justifyContent={"space-between"}>
                <Text fontSize={15} color={"gray.500"}>Bus Offering Received </Text>
                <Text fontSize={16} fontWeight={600} color={"gray.500"} textAlign={"center"}>Ghc {data?.data?.financeInfo?.offering || 0}</Text>
              </Flex>
          </Box>)}

          <Flex gap={3}>
            {isLoading ? <Skeleton  mt={3} h={12} w="100%" rounded={"md"} /> : (
            <Flex justifyContent={"space-between"} 
                  flex={1} p={2} rounded={"md"} 
                  bg="red.100" borderWidth={1} 
                  borderColor={"red.200"} mt={3}
                  cursor={"pointer"}
                  onClick={() => router.push('/bus/bus-head/no-activity')}
            >
              <Text fontSize={15} fontWeight={600} color={"red.400"}>No activity zones</Text>
              <Text fontSize={15} fontWeight={600} color={"red.400"}>{data?.data?.notStarted.length}</Text>
            </Flex>)}
          {isLoading ? <Skeleton  mt={3} h={12} w="100%" rounded={"md"} /> : <Flex justifyContent={"space-between"} 
                  flex={1} p={2} rounded={"md"} 
                  bg="orange.100" borderWidth={1} 
                  borderColor={"orange.200"} mt={3}
                  cursor={"pointer"}
                  onClick={() => router.push('/bus/bus-head/target')}
            >
              <Text fontSize={15} fontWeight={600} color={"orange.400"}>Target not met</Text>
              <Text fontSize={15} fontWeight={600} color={"orange.400"}>{data?.data?.unMetTarget?.length}</Text>
            </Flex>}
          </Flex>

          <DeleteBusRound isOpen={isOpen} onClose={onClose} bus={selectedBus as IBusRound}/>

          <Box py={6}>
            <Text fontWeight={600} color={"gray.500"}>Bus Zones</Text>
            {isLoading && <Skeleton w="100%" h={24} rounded="md" />}

            <Box>
              {!isLoading && Object.keys(data?.data.zones||{})?.map((item : string) => (
                  <ZoneCard
                      key={item} 
                      loading={isLoading} 
                      data={data?.data?.zones[item] as IBusRound[]}  
                      name={item} 
                      setSelectedBus={setSelectedBus}
                      onOpen={onOpen}
                  />
              ))}
            </Box>
          </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
