/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Box,
  Grid,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import moment from "moment";
import _,{ 
  groupBy

 } from 'lodash';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import {FaMinus} from 'react-icons/fa'
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
    walkinPercent: 0,
    previousHeadcount: 0,
    previousBusRound:  0,
    busPercentChange: 0,
    headcountPercentChange: 0
  })


  const getBusRound = async () => {
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
      const groupByDate = groupBy(busRounds, (o: any) => {return moment(o.created_on).format('DD-MM-YYYY')})
      const dates = Object.keys(groupByDate);
      
      const orderedRows = dates.sort((a,b) => moment(a).toDate().getTime() - moment(b).toDate().getTime())
      setLatestDate(orderedRows[orderedRows.length - 1])
      setPreviousDate(orderedRows[orderedRows.length - 2])
    }
  }

  const groupByDate = (date: string, data: any[], isLatest: boolean) => {
    const allData = data.filter(item => moment(item.created_on).format('DD-MM-YYYY') === moment(date,'DD-MM-YYYY').format('DD-MM-YYYY'))
    if(allData.length && allData[0].totalPeople){
      const total = allData.reduce((sum, curr) => {
        sum = sum + curr.totalPeople
        return sum
      },0)
      if(isLatest){
        setLatestData(prev => ({...prev, busRound: total}))
      }else {
        setLatestData(prev => ({...prev, previousBusRound: total}))
      }
    }

    if(allData.length && allData[0].total){
      const highest = allData.sort((a, b) => Number(b.total) - Number(a.total))
      if(isLatest){
        setLatestData(prev => ({...prev, headCount: highest[0].total, lowestHeadcount: highest[highest.length-1].total}))
      }else {
        setLatestData(prev => ({...prev, previousHeadcount: highest[0].total}))
      }
    }

  }

  useEffect(() => {
    if(latestData.busRound && latestData.headCount){
      const busingPercent = (latestData.busRound/latestData.headCount) * 100
      const walkinPercent = ((latestData.headCount - latestData.busRound)/latestData.headCount) * 100
      setLatestData(prev => ({
        ...prev, 
        busingPercent: Number(busingPercent.toFixed(2)), 
        walkinPercent: Number(walkinPercent.toFixed(2)),
        busPercentChange: Number((((latestData.busRound - latestData.previousBusRound) / latestData.previousBusRound) * 100).toFixed(1)),
        headcountPercentChange:  Number((((latestData.headCount - latestData.previousHeadcount) / latestData.previousHeadcount) * 100).toFixed(1))
      }))
    }
  }, [latestData.busRound && latestData.headCount])

  useEffect(() => {
    if(latestDate.length){
      groupByDate(latestDate, busRounds, true)
      groupByDate(latestDate, headcount, true)
    }

    if(previousDate.length){
      groupByDate(previousDate, busRounds, false)
      groupByDate(previousDate, headcount, false)
    }

  },[latestDate, previousDate, busRounds, headcount] )

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
                    <Text fontWeight={500}>{moment(latestDate, 'DD-MM-YYYY').format('ddd, Do MMM YYYY')}</Text>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <Box>
                      <Flex align={"center"} gap={2}>
                        <Text fontSize={48} my={1} lineHeight={1.2} color="gray.500">{latestData.headCount}</Text>
                        <Flex direction={"column"}>
                          <Flex  rounded={"sm"} h={4}>
                            <Text fontSize={14} color={latestData.headcountPercentChange > 0 ? "green.400" : latestData.headcountPercentChange < 0 ? "red.400" : "gray.400"}>{Math.abs(latestData.headcountPercentChange)}%</Text>
                            <Box>
                              {latestData.headcountPercentChange > 0 ? <Icon as={AiFillCaretUp} color="green.400" fontSize={20} /> : latestData.headcountPercentChange < 0 ? <Icon as={AiFillCaretDown} color="red.400" fontSize={20} /> : <Icon as={FaMinus} color="gray.400" fontSize={20} />}
                            </Box>
                          </Flex>
                          <Text color={"gray.500"} fontSize={20}>{latestData.previousHeadcount}</Text>
                        </Flex>
                      </Flex>
                      <Text color="gray.500">Headcount</Text>
                    </Box>
                    <Box>
                      <Flex align={"center"} gap={2}>
                        <Text fontSize={48} my={1} lineHeight={1.2} color="gray.500">{latestData.busRound}</Text>
                        <Flex direction={"column"}>
                          <Flex rounded={"sm"} h={4}>
                            <Text fontSize={14} color={latestData.busPercentChange > 0 ? "green.400" : latestData.busPercentChange < 0 ? "red.400" : "gray.400"}>{Math.abs(latestData.busPercentChange)}%</Text>
                            <Box>
                              {latestData.busPercentChange > 0 ? <Icon as={AiFillCaretUp} color="green.400" fontSize={20} /> : latestData.busPercentChange < 0 ? <Icon as={AiFillCaretDown} color="red.400" fontSize={20} /> : <Icon as={FaMinus} color="gray.400" fontSize={20} />}
                            </Box>
                          </Flex>
                           <Text color={"gray.500"} fontSize={20}>{latestData.previousBusRound}</Text>
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
                      <Text fontSize={15} color="gray.500">Bused percentage</Text> 
                      <Text fontWeight={600}>{latestData.busingPercent}%</Text>
                    </Flex>
                    <Flex my={1} gap={3} justify={"space-between"}>
                      <Text fontSize={15} color="gray.500">Walk-in percentage</Text> 
                      <Text fontWeight={600}>{latestData.walkinPercent}%</Text>
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
