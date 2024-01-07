/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { TbChevronLeft } from 'react-icons/tb'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { getSpecificBusData } from '@/frontend/store/bus'
import { IBusAccount, IBusGroups } from '@/interface/bus'
import { useBaseGetQuery } from '@/frontend/apis/base'


const ZoneListCard = ({zones, active}: {zones: string[], active: boolean}) => {

    const {isLoading, data} = useBaseGetQuery<IBusGroups[]>(
        'bus-groups',
        {
        _id: {'$in': zones},
        type: "ZONE"
    },
       {ids: zones}, 
       !!zones
    )


    return (
        <Box>
            {isLoading ? <Box gap={4}>
                <Skeleton h={24} rounded="md" flex={1} mb={4} />
                <Skeleton h={24} rounded="md" flex={1} />
           </Box>: data?.data.map(item => (
                <Box key={item._id} mb={3} bg="gray.100" p={3} rounded={"md"}>
                    <Flex justifyContent={"space-between"}>
                        <Text color={active ? "blue.500" : "gray.500"} fontWeight={600}>{item.name}</Text>
                        <Text color={active ? "blue.500" : "gray.500"} fontWeight={600}>{item?.fullParent?.name}</Text>
                    </Flex>

                    <Text mt={2} color={"gray.500"} fontSize={14}>Bus Head(s)</Text>
                    <Flex gap={2} wrap={"wrap"}>
                        {item.accounts?.map(a => (
                            <Box key={(a as IBusAccount)?._id} px={4} py={1} fontSize={14} bg={active ? "blue.100" : "gray.300"} color={active ? "blue.500" : "gray.600"} rounded={"md"} textTransform={"capitalize"}>{(a as IBusAccount)?.name as string}</Box>
                        ))}
                    </Flex>
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
  const [savedData, setSavedData] = useState<{all: string[], busless: string[]}>()
  

  const router = useRouter()
  useEffect(() => {
    const list = getSpecificBusData<IEventData>('selected-event')
    setExtraData(list)

    const zones = getSpecificBusData<{all: string[], busless: string[]}>('saved-zones')
    setSavedData(zones)
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
                    <Text fontWeight={600}>Zone Summary</Text>
                    <Text>{extraData?.name}</Text>
                </Box>
        </Flex>
        
        <Box maxH={"calc(100vh - 230px)"} overflowY={"scroll"}>
                  {
          (<Box>
            <Box mt={4}>
                 <Tabs>
                    <TabList>
                        <Tab _selected={{bg: "gray.200"}} color={"gray.500"}>Bused Zones</Tab>
                        <Tab _selected={{bg: "gray.200"}} color={"gray.500"}>Busless Zones</Tab>
                    </TabList>
                    <TabPanels mt={4}>
                        <TabPanel p={0}>
                            <ZoneListCard 
                                zones={savedData?.all?.filter(item => !savedData.busless.includes(item)) || []} 
                                active={true}
                            />
                        </TabPanel>
                        <TabPanel p={0}>
                            <ZoneListCard 
                                zones={savedData?.busless || []} 
                                active={false}
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
