/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { getActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { IBusAccount, IBusGroups } from '@/interface/bus'
import { TbChevronLeft } from 'react-icons/tb'
import { IEvent } from '@/interface/events'
import { getExtraBusRecord } from '@/frontend/store/bus'
import { useBaseGetQuery } from '@/frontend/apis/base'



export default function BranchHead() {
  const [event, setEvent] = useState<IEvent>()
  const [extraData, setExtraData] = useState<{notStarted?: string[]}>()
  const router = useRouter()


    //GET BUS GROUPS WITH NO ACTIVITY
    const {isLoading, data} = useBaseGetQuery<IBusGroups[]>(
      'bus-groups',
      {
        _id: {'$in': extraData?.notStarted}
      },
      {ids: extraData?.notStarted},
      !!extraData?.notStarted
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
                <Text fontSize={17} fontWeight={600}> Zones That Didn&apos;t Bus</Text>
                <Text  fontSize={14}>{event?.name}</Text>
            </Box>
        </Flex>

        {isLoading ? <Box>
            <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
            <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
            <Skeleton mb={2} rounded={"md"} h={24} w="100%" />
            <Skeleton rounded={"md"} h={24} w="100%" />

        </Box> :  <Box mt={8} maxH={'430px'} overflowY={'scroll'}>
           {data?.data.map(item => (
             <Box mb={3} bg="gray.100" p={4} rounded={"md"} key={item._id}>
                <Text color={"gray.500"} fontWeight={600}>{item.name}</Text>

                <Text mt={2} color={"gray.500"} fontSize={14}>Bus Account(s)</Text>
                <Flex gap={2} wrap={"wrap"}>
                    {(item.accounts as IBusAccount[])?.map((l) => (
                        <Box key={l._id} px={4} py={1} fontSize={14} bg="blue.100" color={"gray.700"} rounded={"md"} textTransform={"capitalize"}>{l.name}</Box>
                    ))}
                </Flex>
            </Box>
           ))}
        </Box>}

      </AppWrapper>
    </GuardWrapper>
  )
}
