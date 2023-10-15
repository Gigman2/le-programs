/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { useBusRounds } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { getActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { TbChevronLeft } from 'react-icons/tb'
import { IEvent } from '@/interface/events'
import { getExtraBusRecord } from '@/frontend/store/bus'



export default function BranchHead() {
  const [event, setEvent] = useState<IEvent>()
  const [extraData, setExtraData] = useState<{unMetTarget?: string[]}>()
  const router = useRouter()


    const {isLoading, data, error} = useBusRounds({
        _id: {'$in': extraData?.unMetTarget}
    },
        {ids: extraData?.unMetTarget}, !!extraData?.unMetTarget
    )

    useEffect(() => {
        const user = getUser() as IAccountUser
        if(!user) router.push('/bus/login')

        const currentEvent = getActiveEvent()
        if(!currentEvent)  router.push('/bus/bus-head')
        setEvent(currentEvent)

        const record = getExtraBusRecord()
        setExtraData(record)
    },[])

  return (
    <GuardWrapper allowed={['BUS_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
         <Flex gap={4} mt={4}>
            <Flex px={3} py={4} align={"center"} rounded={"md"} bg="gray.200" h={14} cursor={"pointer"}
                onClick={() => router.back()}
            >
                <Icon as={TbChevronLeft} fontSize={32} color={"gray.500"} />
            </Flex>
            <Box textAlign={"center"} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
                <Text fontSize={17} fontWeight={600}> Bused less than 8</Text>
                <Text  fontSize={14}>{event?.name}</Text>
            </Box>
        </Flex>

        {isLoading ? 
            <Box>
                <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
                <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
                <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
                <Skeleton rounded={"md"} h={24} w="100%" />

            </Box> 
        :
            <Box mt={6} maxH={"430px"} overflowY={"scroll"}>
            {data?.data.map(item => (
                <Box key={item._id} bg="gray.100" rounded={"md"} p={4} mb={3}>
                    <Flex justifyContent={"space-between"} align={"center"}>
                        <Text fontWeight={600} fontSize={16} color={"gray.500"}>{(item.busZone as unknown as {name: string}).name} | {(item.recordedBy as unknown as {name: string}).name}</Text>
                        <Flex align={"center"} gap={2} color={"gray.600"}>
                            <Text fontWeight={600} fontSize={16} color={"gray.400"}>People</Text>
                            <Text fontWeight={600} fontSize={20}>{item.people}</Text>
                        </Flex>
                    </Flex>
                    <hr />
                    <Flex gap={2} justifyContent={"space-between"}>
                        <Flex align={"center"} gap={2}>
                            <Text fontWeight={600} fontSize={15} color={"gray.400"}>Bus Offering</Text>
                            <Text fontWeight={600} fontSize={18} color={"gray.500"}>Ghc {item.busOffering}</Text>
                        </Flex>

                        <Flex align={"center"} gap={2}>
                            <Text fontWeight={600} fontSize={15} color={"gray.400"}>Bus Cost</Text>
                            <Text fontWeight={600} fontSize={18} color={"gray.500"}>Ghc {item.busCost}</Text>
                        </Flex>
                    </Flex>
                </Box>
            ))}
        </Box>
        }

      </AppWrapper>
    </GuardWrapper>
  )
}
