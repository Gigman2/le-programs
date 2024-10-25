/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TbChevronLeft } from 'react-icons/tb'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { getSpecificBusData } from '@/frontend/store/bus'
import { IBusRound } from '@/interface/bus'
import { useBaseGetQuery } from '@/frontend/apis/base'



const ZoneListCard = ({records, active}: {records: string[], active: boolean}) => {

    const {isLoading, data, error} = useBaseGetQuery<IBusRound[]>(
        'bus-rounds',
        {
            _id: {'$in': records},
        },
        {ids: records}, 
        !!records
    )
    return (
        <Box>
            {isLoading ? <Box gap={4}>
                <Skeleton h={24} rounded="md" flex={1} mb={4} />
                <Skeleton h={24} rounded="md" flex={1} />
            </Box>: data?.data?.map(item => (
                <Box key={item._id} mb={3} bg="gray.100" p={3} rounded={"md"}>
                    <Flex justifyContent={"space-between"}>
                        <Text color={active ? "blue.500" : "gray.500"} fontWeight={600}>{(item.recordedBy as unknown as {name: string}).name}</Text>
                    </Flex>
                    <Flex align={"center"} justify={"space-between"}>
                        <Text fontSize={15} fontWeight={600} color="gray.600">{(item.busZone as unknown as {name: string}).name} zone</Text>
                        <Text fontWeight={600} fontSize={20} color={"gray.600"}>{item.people} <Text as="span" fontWeight={500} fontSize={15}>people</Text></Text>
                    </Flex>

                    <Box mt={2}>
                        <Text fontSize={14} color={"gray.500"}>Last checkpoints</Text>
                        <Flex mt={1} gap={2} wrap={"wrap"}>
                            {item.stopPoints?.map((s, index) => <Box fontSize={14} color={(index === ((item?.stopPoints || [])?.length - 1) && !active) ? 'white' : "blue.500"} bg={(index === ((item?.stopPoints || [])?.length - 1) && !active) ? "blue.600" : "blue.100"} py={1} px={3} rounded={"md"} key={s.location+item._id}>{s.location}</Box>)}
                        </Flex>
                    </Box>
                </Box>
            ))}
        </Box> 
    )
}

export interface IEventData { 
      id: string,
      name:string,
      start: string,
      end: string,
      timeSince: string,
      live: boolean
  }

export default function SectorHead() {
    const [extraData, setExtraData] = useState<IEventData>()
    const [savedData, setSavedData] = useState<{arrived: string[], enroute: string[]}>()

  const router = useRouter()
  useEffect(() => {
    const list = getSpecificBusData<IEventData>('selected-event')
    setExtraData(list)

    const buses = getSpecificBusData<{arrived: string[], enroute: string[]}>('saved-buses')
    setSavedData(buses)
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
                <Box textAlign={"center"} p={1} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
                    <Text fontWeight={600}>Bus Summary</Text>
                    <Text>{extraData?.name}</Text>
                </Box>
        </Flex>
        
        <Box maxH={"calc(100vh - 230px)"} overflowY={"scroll"}>
                  {
          (<Box>
            <Box mt={4}>
                 <Tabs>
                    <TabList>
                        <Tab _selected={{bg: "gray.200"}} color={"gray.500"}>En route</Tab>
                        <Tab _selected={{bg: "gray.200"}} color={"gray.500"}>Arrived</Tab>
                    </TabList>
                    <TabPanels mt={4}>
                        <TabPanel p={0}>
                            <ZoneListCard 
                                records={savedData?.enroute || []} 
                                active={false}
                            />
                        </TabPanel>
                        <TabPanel p={0}>
                            <ZoneListCard 
                                records={savedData?.arrived || []} 
                                active={true}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
          </Box>)
        }
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
