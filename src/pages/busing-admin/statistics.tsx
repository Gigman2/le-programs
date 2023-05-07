/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Flex,
  Skeleton,
  GridItem,
  Text,
  Icon,
} from "@chakra-ui/react";
import moment from "moment";
import _ from 'lodash';
import {IoPeopleOutline} from 'react-icons/io5'
import { TbBus } from "react-icons/tb";
import { IBusRound } from "@/interface/bus";
import { group } from "console";

export default function OverView() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [loading, setLoading] = useState(false);

  const [allBus, setAllBus] = useState<Record<string, any>>({});
  const [allGroups, setAllGroups] = useState<Record<string, any>>({});
  const [summary, setSummary] = useState<Record<string, number>>({
    buses: 0,
    people: 0,
    fare: 0
  });

  const [data, setData] = useState([]);


  const getBus = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = { 
          busGroup : { $exists: true, $ne: null } 
        }
        const res = await fetch(`${baseUrl}/api/bus_rounds/getBusRounds`, {
          method: 'post', 
          body: JSON.stringify(apiPayload)
        })
        const response = await res.json()

        setData(response.data || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getGroups = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = {}
        const res = await fetch(`${baseUrl}/api/bus_groups/getBusGroups`, {
          method: 'post',
          body: JSON.stringify(apiPayload)
        })
        const response = await res.json()
        let total = (response.data || [])
        setAllGroups({})

        await Promise.all(total.map((item:any) => {
          setAllGroups(prev =>( {...prev, [item._id] : item.groupName}))
        }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const groupBusGroups = (data: any) => {
    const grouped: Record<string, Record<string, Record<string, {bus? : number, people?: number}>>> = {}

    const dateGrouped = _.groupBy(data, (item: any) => {
        return moment(item.created_on).format('DD-MM-YYYY')
    })

    Object.keys(dateGrouped).map(item =>{
      dateGrouped[item].map((group: IBusRound) => {
        const month = moment(group.created_on).format('MMMM YY')
        if(!grouped[month]) grouped[month] = {}

        if(!grouped[month][moment(group.created_on).format('ddd, DD')])
          grouped[month][moment(group.created_on).format('ddd, DD')] = {}

        if(!grouped[month][moment(group.created_on).format('ddd, DD')][group.busGroup])
          grouped[month][moment(group.created_on).format('ddd, DD')][group.busGroup] = {}

        if(grouped[month][moment(group.created_on).format('ddd, DD')][group.busGroup]) {
          let sum = grouped[month][moment(group.created_on).format('ddd, DD')][group.busGroup]
          sum.people = Number((sum.people || 0) + group.totalPeople)
          sum.bus = Number(sum.bus|| 0 + (group.busState === 'ARRIVED' ? 1 :0))
        }
      })
    }) 

    setAllBus(grouped)
  }

  const getSummary = (data: IBusRound[]) => {
    const busSummary = data.reduce((sum, curr) => {
      sum.buses = sum.buses  + (curr.busState === 'ARRIVED' ? 1 :0)
      sum.people = sum.people + Number(curr.totalPeople)
      sum.fare = sum.fare + Number(curr.busFare)
      return sum
    }, {
      buses: 0,
      people: 0,
      fare: 0
    })

    setSummary(busSummary)
  }

  useEffect(() => {
    if(data.length){
      groupBusGroups(data)
      getSummary(data)
    }
  }, [data])

  useEffect(() => {
    getGroups()
    getBus()
  }, [])


  return (
    <> 
      <Head>
        <title>Love Economy Church | Swollen Sunday - admin </title>
        <meta name="description" content="An app to record how God has blessed us with great increase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex w="100%" justify={"center"}>
            <Box minW={"500px"} w="350px" mt={5}>
                <Box fontSize={15} color="gray.500" textAlign={"center"} mb={2}>
                  <Text fontWeight={600} color="gray.500" fontSize={15} mb={1}>Busing Summary</Text>
                  <Text as="span" fontWeight={600}>26th March</Text> - <Text as="span" fontWeight={600}>07th May 2023</Text>
                </Box>
                <Grid templateColumns={'repeat(3, 1fr)'} gap={3}>
                  <Box p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"} position={"relative"} h={24}>
                    <Text fontSize={14} color="gray.400">Total Buses</Text>
                    <Text fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}>{summary.buses}</Text>
                  </Box>
                  <Box p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"} position={"relative"}>
                    <Text fontSize={14} color="gray.400">People Transported</Text>
                    <Text fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}>{summary.people}</Text>
                  </Box>
                  <Box p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"}  position={"relative"}>
                    <Text fontSize={14} color="gray.400">Total Bus Fare</Text>
                    <Flex align={"center"} gap={2} fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}><Text fontSize={13}>Ghc</Text> {summary.fare}</Flex>
                  </Box>
                </Grid>

                <Grid templateColumns={'repeat(2, 1fr)'} gap={3} my={3}>
                  <Flex p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"} gap={2} align={"center"}>
                    <Text fontSize={20} color="gray.600" fontWeight={600}>{Object.keys(allGroups).length}</Text>
                    <Text fontSize={14} color="gray.400">Bus groups</Text>
                  </Flex>
                  <Flex p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"} gap={2}  align={"center"}>
                    <Text fontSize={20} color="gray.600" fontWeight={600}>{Object.keys(allBus).length}</Text>
                    <Text fontSize={14} color="gray.400">Events</Text>
                  </Flex>
                </Grid>

                {Object.keys(allBus).map(item => (
                <Box key={item} my={3} p={3} borderWidth={1} borderColor={"gray.300"} rounded={"md"} >
                  <Flex justifyContent={"space-between"} fontWeight={500} color="gray.600" fontSize={15}  borderBottomWidth={1} borderColor={"gray.300"}>
                    <Text fontWeight={600} >{item}</Text>
                    {/* <Text>Buses: <Text as="span" fontWeight={600}>20</Text></Text> */}
                  </Flex>

                  <Box>
                      <Grid
                        my={2} 
                        py={1}
                        columnGap={6} 
                        fontSize={14} 
                        fontWeight={600} 
                        color="gray.600"
                        borderBottomWidth={1} 
                        borderColor={"gray.200"} 
                        templateColumns="repeat(12,1fr)"  
                      >
                        <Box as={GridItem} colSpan={2}>Day</Box>
                       {Object.keys(allGroups).map(item => <Box key={item} mt={1} as={GridItem} colSpan={2} fontWeight={600}>{allGroups[item] as string}</Box>)}
                        <Box as={GridItem} colSpan={1}>Total</Box>
                      </Grid>

                      {Object.keys(allBus[item]).map(date => (
                        <Grid
                        key={date}
                        py={2}
                        columnGap={6} 
                        fontSize={13} 
                        color="gray.600"
                        borderBottomWidth={1} 
                        borderColor={"gray.200"} 
                        templateColumns="repeat(12,1fr)"  
                      >
                        <Box as={GridItem} colSpan={2} fontWeight={600} mt={2} ml={2}>{date}</Box>
                        {Object.keys(allGroups).map(group => <Box key={date+"-"+group} as={GridItem} colSpan={2} >
                          <Flex  align={"center"} gap={1}>
                            <Icon as={TbBus} fontSize={15} color={"gray.500"} /> 
                            {(allBus[item][date] && allBus[item][date][group] && allBus[item][date][group].bus) || '--'}
                          </Flex>
                          <Flex align={"center"} gap={1}>
                            <Icon as={IoPeopleOutline} fontSize={15} color={"gray.500"} /> 
                            {(allBus[item][date] && allBus[item][date][group] && allBus[item][date][group].people) || '--'}
                          </Flex>
                        </Box>)}

                        <Box as={GridItem} colSpan={2} >
                          <Flex  align={"center"} gap={1}>
                            <Icon as={TbBus} fontSize={15} color={"gray.500"} /> 
                            {Object.keys(allBus[item][date]).reduce((sum, curr) => {
                              if(allBus[item][date][curr]) 
                                sum = allBus[item][date][curr].bus + sum
                              return sum
                            }, 0)}
                          </Flex>
                          <Flex align={"center"} gap={1}>
                            <Icon as={IoPeopleOutline} fontSize={15} color={"gray.500"} /> 
                          {Object.keys(allBus[item][date]).reduce((sum, curr) => {
                              if(allBus[item][date][curr]) 
                                sum = allBus[item][date][curr].people + sum
                              return sum
                            }, 0)}
                          </Flex>
                        </Box>
                      </Grid>
                      ))}
                  </Box>
                </Box>))}
            </Box>
        </Flex>
      </main>
    </>
  );
}
