/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import { IBusRound } from "@/interface/bus";
import { IHeadcount } from "@/interface/headcount";

export default function OverView() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [loading, setLoading] = useState(false);

  const [latestDate, setLatestDate] = useState('');
  const [previousDate, setPreviousDate] = useState('');

  const [busRounds, setBusRounds] = useState<IBusRound[]>([]);
  const [headcount, setHeadcounts] = useState<IHeadcount[]>([]);

  const [latestData, setLatestData] = useState({
    busRound: 0,
    headCount: 0,
    lowestHeadcount: 0,
    busingPercent: 0,
    walkinPercent: 0
  })


  const getBusRound = async () => {
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
        setBusRounds(response.data || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getHeadCount = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = {}
        const res = await fetch(`${baseUrl}/api/head_count/getHeadcount`, {
          method: 'post', 
          body: JSON.stringify(apiPayload)
        })
        const response = await res.json()
        setHeadcounts(response.data || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getLatestDate = () => {
    if(busRounds.length){
      const lastRow = busRounds.sort((a,b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())[0]
      setLatestDate(lastRow.created_on)
      const previousRow = busRounds.sort((a,b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())[1]
      setPreviousDate(previousRow.created_on)
    }
  }

  const groupByDate = (date: string, data: any[]) => {
    const allData = data.filter(item => moment(item.created_on).format('DD-MM-YYYY') === moment(date).format('DD-MM-YYYY'))
    if(allData.length && allData[0].totalPeople){
      const total = allData.reduce((sum, curr) => {
        sum = sum + curr.totalPeople
        return sum
      },0)

      setLatestData(prev => ({...prev, busRound: total}))
    }

    if(allData.length && allData[0].total){
      const highest = allData.sort((a, b) => Number(b.total) - Number(a.total))
      setLatestData(prev => ({...prev, headCount: highest[0].total, lowestHeadcount: highest[highest.length-1].total}))
    }
  }

  useEffect(() => {
    if(latestData.busRound && latestData.headCount){
      const busingPercent = (latestData.busRound/latestData.headCount) * 100
      const walkinPercent = ((latestData.headCount - latestData.busRound)/latestData.headCount) * 100
      setLatestData(prev => ({...prev, busingPercent: Number(busingPercent.toFixed(2)), walkinPercent: Number(walkinPercent.toFixed(2))}))
    }
  }, [latestData])

  useEffect(() => {
    if(latestDate.length){
      groupByDate(latestDate, busRounds)
      groupByDate(latestDate, headcount)
    }
  },[latestDate, busRounds, headcount] )

  useEffect(() => {
    getLatestDate()
  },[busRounds])

  useEffect(() => {
    getBusRound()
    getHeadCount()
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
                    <Text fontWeight={500}>{moment(latestDate).format('ddd, Do MMM YYYY')}</Text>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <Box>
                      <Flex align={"center"} gap={1}>
                        <Text fontSize={40} my={1} h={12} color="gray.500">{latestData.headCount}</Text>
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
                        <Text fontSize={40} my={1} h={12} color="gray.500">{latestData.busRound}</Text>
                        <Flex bg="green.100" rounded={"sm"}>
                          <Text fontSize={14} color="green.500">12%</Text>
                          <Box>
                            <Icon as={AiFillCaretUp} fontSize={20} color="green.400" />
                          </Box>
                        </Flex>
                      </Flex>
                      <Text color="gray.500">Came by bus</Text>
                    </Box>
                  </Flex>
                  <Grid templateColumns="repeat(2,1fr)" columnGap={12} mt={3}>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Highest Headcount</Text> 
                      <Text fontWeight={600}>{latestData.headCount}</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Lowest Headcount</Text> 
                      <Text fontWeight={600}>{latestData.lowestHeadcount}</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Percentage from busing</Text> 
                      <Text fontWeight={600}>{latestData.busingPercent}</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Walk-in percentage</Text> 
                      <Text fontWeight={600}>{latestData.walkinPercent}</Text>
                    </Flex>
                  </Grid>
                </Box>
                {/* <Grid templateColumns="repeat(2,1fr)" columnGap={6} mb={3}>
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

                <Grid templateColumns="repeat(2,1fr)" columnGap={6} mb={3}>
                  <Box p={4} rounded={"md"} borderColor={"gray.200"} borderWidth={1} >
                      <Text fontSize={15} color="gray.500">Highest bus members</Text>
                      <Text fontSize={32} fontWeight={600}>219</Text>
                      <Text fontSize={15} color="gray.500">Sun, 21st Aug 2021</Text>
                  </Box>
                  <Box p={4} rounded={"md"} borderColor={"gray.200"} borderWidth={1} >
                      <Text fontSize={15} color="gray.500">Lowest bus members</Text>
                      <Text fontSize={32} fontWeight={600}>31</Text>
                      <Text fontSize={15} color="gray.500">Sun, 21st Aug 2021</Text>
                  </Box>
                </Grid> */}
            </Box>
        </Flex>
      </main>
    </>
  );
}
