/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { TbChevronLeft } from 'react-icons/tb'
import { getSpecificBusData } from '@/frontend/store/bus'
import { IEventData } from '.'
import { useBasePostQuery } from '@/frontend/apis/base'

export default function EventSummarySector() {
  const router = useRouter()
  const [eventData, setEventData] = useState<IEventData>()
  const [sectorData, setSectorData] = useState<any>()

  const {isLoading: summaryLoading, data: summary} = useBasePostQuery<any[]>('bus-rounds/sector',
    {...eventData, group: sectorData?._id},  
    {...eventData, group: sectorData?._id} , 
    !!(eventData && sectorData?._id)
  )

  const {isLoading, data} = useBasePostQuery<{
    busInfo: { total_buses: number, arrived: number, on_route: number };
    peopleInfo: { people: number, arrived: number, on_route: number };
    financeInfo: { offering: number, cost: number };
    notStarted: string[];
    unMetTarget: string[];
  }>('bus-rounds/overall-sector',
    {...eventData, group: sectorData?._id},  
    {...eventData, group: sectorData?._id} , 
    !!(eventData && sectorData?._id)
  )

  useEffect(() => {
    const event = getSpecificBusData<IEventData>('selected-event')
    setEventData(event)

    const sector = getSpecificBusData<IEventData>('selected-sector')
    setSectorData(sector)
  },[])
  

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Flex gap={4} mt={4}>
          <Flex px={3} py={4} align={"center"} rounded={"md"} bg="gray.200" h={14} cursor={"pointer"}
              onClick={() => router.back()}
          >
              <Icon as={TbChevronLeft} fontSize={32} color={"gray.500"} />
          </Flex>
          <Box textAlign={"center"} py={1} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
              <Text fontWeight={600}>{sectorData?.name} Summary</Text>
              <Text>{eventData?.name}</Text>
          </Box>
        </Flex>
        <Box maxH={'500px'} overflowY={'scroll'}>
          <Box mt={4}>
          <Box p={3} bg="gray.100" rounded={"md"}>
            <Flex gap={2}>
              <Box bg="blue.100" p={3} rounded={"md"} my={1} flex={1}>
                <Text color={"blue.400"}>Bus in route<Text as="span" ml={2} fontWeight={600}>{data?.data?.busInfo.on_route}</Text></Text>
                <Text color={"blue.400"}>Bus arrived <Text as="span" fontWeight={600}>{data?.data?.busInfo.arrived}</Text></Text>
              </Box>
              <Box bg="blue.100" p={3} rounded={"md"} my={1} flex={1}>
                <Text color={"blue.400"}>People in route<Text as="span" ml={2} fontWeight={600}>{data?.data?.peopleInfo.on_route}</Text></Text>
                <Text color={"blue.400"}>People arrived <Text as="span" fontWeight={600}>{data?.data?.peopleInfo.arrived}</Text></Text>
              </Box>
            </Flex>
            <Box bg="blue.100" p={3} rounded={"md"} my={1}>
              <Text color={"blue.400"}>Bus offering received<Text as="span" ml={2} fontWeight={600}>Ghc {data?.data?.financeInfo.offering}</Text></Text>
              <Text color={"blue.400"}>Actual cost of bus <Text as="span" fontWeight={600}>Ghc {data?.data?.financeInfo.cost}</Text></Text>
            </Box>
          </Box>
          </Box>

          <Box mt={6}>
            <Text color={"gray.500"} fontWeight={600} fontSize={20} >Branches</Text>

            {summaryLoading ? <Flex direction={"column"}>
              <Skeleton h={24} w="100%" mb={3} />
              <Skeleton h={24} w="100%" mb={3} />
              <Skeleton h={24} w="100%" mb={3} />
            </Flex> : null}
            {summary?.data.map((item: any) => 
              <Box key={item.id} rounded={"md"} borderWidth={1} bg={"gray.100"} p={4} mb={4}>
              <Flex justify={"space-between"}>
                <Text color={"gray.500"}>{item.name}</Text>
                <Text color={"gray.500"}><Text as={"span"} fontWeight={600}>{(item?.records?.busArrived || 0) + (item?.records?.busInRoute || 0)}</Text> Buses</Text>
              </Flex>
              <Flex gap={2} wrap={"wrap"} mt={1}>
                {item?.children?.map((k: any) => (<Box key={k} bg={k.bused ? "blue.300" : "gray.400"} color={"white"} px={3} rounded={"md"} fontSize={15}>{k?.name}</Box>))}

              </Flex>
              <Flex justify={"space-between"} borderTopWidth={1} borderBottomWidth={1} borderColor={"gray.300"} mt={2} mb={4} py={3}>
                <Box>
                  <Text fontWeight={600} fontSize={14} color={"gray.400"}>Bus Activity</Text>
                  <Box mt={1} color={"gray.600"}>
                    <Flex gap={2} >
                      <Text>Arrived</Text>
                      <Text fontWeight={600}>{item?.records?.busArrived}</Text>
                    </Flex>
                    <Flex gap={2}>
                      <Text>In Route</Text>
                      <Text fontWeight={600}>{item?.records?.busInRoute}</Text>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight={600} fontSize={14} color={"gray.400"}>People Transported</Text>
                  <Box mt={1} color={"gray.600"}>
                    <Flex gap={2} >
                      <Text>Arrived</Text>
                      <Text fontWeight={600}>{item?.records?.peopleArrived}</Text>
                    </Flex>
                    <Flex gap={2}>
                      <Text>In Route</Text>
                      <Text fontWeight={600}>{item?.records?.peopleInRoute}</Text>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
              <Flex justify={"space-between"} mt={2} color={"gray.500"}>
                <Text>Ghc <Text as={"span"} fontWeight={600}>{item?.records?.offering}</Text> offering</Text>
                <Text>Ghc <Text as={"span"} fontWeight={600}>{item?.records?.cost}</Text> bus cost</Text>
              </Flex>
            </Box>)}
          </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
