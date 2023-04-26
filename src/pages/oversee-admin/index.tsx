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
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function OverView() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [loading, setLoading] = useState(false);

  const [allBus, setAllBus] = useState<Record<string, any>>({});
  const [allGroups, setAllGroups] = useState<Record<string, any>>({});
  const [groups, setGroups] = useState<[]>([]);

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
    const grouped = _.groupBy(data, (item: any) => {
        return moment(item.created_on).format('DD MMM,YY')
    })

    // Group by Bus-Group
    Object.keys(grouped).map(item => {
      const groupedGroupName = _.groupBy(grouped[item], (item: any) =>  item.busGroup)
      grouped[item] = groupedGroupName as any
    }) 

    Object.keys(grouped).map((item) => {
      const groupByDate: any[] | any[][] = grouped[item]
      Object.keys(groupByDate).map(groupId => {
        const total = groupByDate[groupId as any].reduce((sum: any, curr: any) => {
          if(curr.totalPeople)
            sum = sum + curr.totalPeople

          return sum
        }, 0)

        groupByDate[groupId as any] = total
      })
    })

    setAllBus(grouped)
  }

  useEffect(() => {
    if(data.length){
      groupBusGroups(data)
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
            <Box maxW={"500px"} w="500px" mt={5}>
                <Flex justifyContent={"space-between"} align="center" borderBottomWidth={1} pb={1}>
                    <Text fontSize={16} color="gray.600" fontWeight={600}>Main Admin</Text>
                </Flex>

                <Box p={4} rounded={"md"} borderColor={"gray.200"} borderWidth={1} my={3}>
                  <Flex justifyContent={"space-between"} 
                        color="gray.500" 
                        borderColor={"gray.200"} 
                        borderBottomWidth={1}
                  >
                    <Text>Latest Service</Text>
                    <Text fontWeight={500}>Sun, 20th Feb 2023</Text>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <Box>
                      <Flex align={"center"} gap={1}>
                        <Text fontSize={40} my={1} h={12} color="gray.500">456</Text>
                        <Flex bg="red.100" rounded={"sm"}>
                          <Text fontSize={14} color="red.500">12%</Text>
                          <Box>
                            <Icon as={AiFillCaretDown} fontSize={20} color="red.400" />
                          </Box>
                        </Flex>
                      </Flex>
                      <Text color="gray.500">Headcount</Text>
                    </Box>
                    <Box>
                      <Flex align={"center"} gap={1}>
                        <Text fontSize={40} my={1} h={12} color="gray.500">23</Text>
                        <Flex bg="green.100" rounded={"sm"}>
                          <Text fontSize={14} color="green.500">12%</Text>
                          <Box>
                            <Icon as={AiFillCaretUp} fontSize={20} color="green.400" />
                          </Box>
                        </Flex>
                      </Flex>
                      <Text color="gray.500">Buses</Text>
                    </Box>
                  </Flex>
                  <Grid templateColumns="repeat(2,1fr)" columnGap={12} mt={3}>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Highest Headcount</Text> 
                      <Text fontWeight={600}>20</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Lowest Headcount</Text> 
                      <Text fontWeight={600}>20</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Percentage from busing</Text> 
                      <Text fontWeight={600}>20</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Walk-in percentage</Text> 
                      <Text fontWeight={600}>20</Text>
                    </Flex>
                  </Grid>
                </Box>
                <Grid templateColumns="repeat(2,1fr)" columnGap={6} >
                  <Box p={4} rounded={"md"} borderColor={"gray.200"} borderWidth={1} >
                      <Text fontSize={15} color="gray.500">Highest Headcount</Text>
                      <Text fontSize={32} fontWeight={600}>219</Text>
                      <Text fontSize={15} color="gray.500">Sun, 21st Aug 2021</Text>
                  </Box>
                  <Box p={4} rounded={"md"} borderColor={"gray.200"} borderWidth={1} >
                      <Text fontSize={15} color="gray.500">Lowest Headcount</Text>
                      <Text fontSize={32} fontWeight={600}>31</Text>
                      <Text fontSize={15} color="gray.500">Sun, 21st Aug 2021</Text>
                  </Box>
                </Grid>
            </Box>
        </Flex>
      </main>
    </>
  );
}
