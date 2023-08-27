/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import _ from 'lodash';
import { TbChevronDown } from "react-icons/tb";
import { IBusRound } from "@/interface/bus";

export default function OverView() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [loading, setLoading] = useState(false);

  const [allGroups, setAllGroups] = useState<Record<string, any>>({});
  const [busSummary, setBusSummary] = useState<Record<string, any>>({});
  const [collapse, setCollapse] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [summary, setSummary] = useState<Record<string, number>>({
    buses: 0,
    people: 0,
    fare: 0
  });

  const [data, setData] = useState([]);

  const loadSummary = async () => {
    try {
      if(!loading){
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/bus_rounds/bus-round-summary`, {
          method: 'get', 
        })
        const response = await res.json()

        console.log(response)
        setBusSummary(response.data.data || [])
        setTotal(response.data.total)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getBus = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = { 
          busGroup : { $exists: true, $ne: null } 
        }
        const res = await fetch(`${baseUrl}/api/bus_rounds`, {
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
      getSummary(data) 
    }
  }, [data])

  useEffect(() => {
    getGroups()
    getBus()
    loadSummary()
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
                  <Text fontWeight={800} color="gray.500" fontSize={18} mb={1}>Busing Summary</Text>
                  <Text as="span" fontWeight={600}>26th March</Text> - <Text as="span" fontWeight={600}>07th May 2023</Text>
                </Box>
                <Grid templateColumns={'repeat(3, 1fr)'} gap={3}>
                  <Box p={3} bg={"gray.100"} rounded={"md"} position={"relative"} h={24}>
                    <Text fontSize={14} color="gray.500">Total Buses</Text>
                    <Text fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}>{summary.buses}</Text>
                  </Box>
                  <Box p={3} bg={"gray.100"} rounded={"md"} position={"relative"}>
                    <Text fontSize={14} color="gray.500">People Transported</Text>
                    <Text fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}>{summary.people}</Text>
                  </Box>
                  <Box p={3} bg={"gray.100"} rounded={"md"}  position={"relative"}>
                    <Text fontSize={14} color="gray.500">Total Bus Fare</Text>
                    <Flex align={"center"} gap={2} fontSize={20} color="gray.600" fontWeight={600} position={"absolute"} bottom={1}>
                      <Text fontSize={13}>Ghc</Text> {summary.fare.toFixed(2)}
                    </Flex>
                  </Box>
                </Grid>

                <Grid templateColumns={'repeat(2, 1fr)'} gap={3} my={3}>
                  <Flex p={3} bg={"gray.100"} rounded={"md"} gap={2} align={"center"}>
                    <Text fontSize={20} color="gray.600" fontWeight={600}>{Object.keys(allGroups).length}</Text>
                    <Text fontSize={14} color="gray.500">Bus groups</Text>
                  </Flex>
                  <Flex p={3}  bg={"gray.100"} rounded={"md"} gap={2}  align={"center"}>
                    <Text fontSize={20} color="gray.600" fontWeight={600}>{total}</Text>
                    <Text fontSize={14} color="gray.500">Events</Text>
                  </Flex>
                </Grid>

                <Box my={8}>
                    {Object.keys(busSummary).map((item, i) =>  <Box key={item} mt={6}>
                        <Flex 
                          align={"center"} 
                          cursor={"pointer"}
                          justifyContent={"space-between"} 
                          onClick={() => setCollapse(i)}>
                          <Text fontWeight={600} color={"gray.600"}>{item}</Text>
                          <Box mr={2}>
                            <Icon as={TbChevronDown} fontSize={20}/>
                          </Box>
                        </Flex>
                        {Object.keys(busSummary[item]).map(c => 
                          <Box key={item+'-'+c} rounded={'md'} bg="gray.100" p={4} mb={3} display={collapse !== i ? 'none' : 'block'}>
                            <Flex justifyContent={'space-between'} fontSize={15} color={"gray.500"} mb={1} fontWeight={600}>
                                <Text>{c}</Text>
                                <Text>{busSummary[item][c].eventName}</Text>
                            </Flex>
                            <hr />
                            <Flex  mt={1} justifyContent={'space-between'} color={"gray.500"}>
                              <Flex gap={2}>
                                <Text fontSize={15}>Total Buses</Text>
                                <Text fontWeight={700} color={"gray.500"}>{busSummary[item][c].totalBuses}</Text>
                              </Flex>

                              <Flex gap={2}>
                                <Text fontSize={15}>People Bused</Text>
                                <Text fontWeight={700} color={"gray.500"}>{busSummary[item][c].peopleBused}</Text>
                              </Flex>
                            </Flex>
                            <Flex  mt={1} justifyContent={'space-between'} color={"gray.500"}>
                              <Flex gap={2}>
                                <Text fontSize={15}>Total offering received</Text>
                                <Text fontWeight={700} color={"gray.500"}>Ghc {busSummary[item][c].offering}</Text>
                              </Flex>

                              <Flex gap={2}>
                                <Text fontSize={15}>Actual Busing Cost</Text>
                                <Text fontWeight={700} color={"gray.500"}>Ghc {busSummary[item][c].cost}</Text>
                              </Flex>
                            </Flex>
                          </Box>)
                        }
                    </Box>)}
                </Box>
            </Box>
        </Flex>
      </main>
    </>
  );
}
