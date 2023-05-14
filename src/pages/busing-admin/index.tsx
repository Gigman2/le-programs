/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";

export default function OverView() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [allBus, setAllBus] = useState([]);
  const [allGroups, setAllGroups] = useState([]);


  const [busInfo, setBusInfo] = useState<Record<string, string | number>>({
    'Total Buses': 200,
    'Arrived': 200,
    'On Route': 200
  });

  const [peopleInfo, setPeopleInfo] = useState<Record<string, string | number>>({
    'People': 200,
    'Arrived': 200,
    'On Route': 200,
  });

  const [finance, setFinance] = useState<Record<string, string | number>>({
    'Fare Collected': 200,
    'Total Bus Fare': 200,
  });

  const getBus = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = { 
          busGroup : { $exists: true, $ne: null },
          created_on: {
              $gt: moment().startOf('day').toDate(),
              $lt: moment().endOf('day').toDate(),
            }
        }
        const res = await fetch(`${baseUrl}/api/bus_rounds/getBusRounds`, {
          method: 'post',
          body: JSON.stringify(apiPayload)
        })
        const response = await res.json()
        let allBus = (response.data || [])
        setAllBus(allBus)
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
        setAllGroups(total)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const updateCard = () => {
    const updateBusCard = allBus.reduce((acc:Record<string, number>, obj:Record<string, string>) => {
          if(acc){
            acc['Total Buses'] += 1
            if(obj['busState']  === 'ARRIVED') acc['Arrived'] += 1
            if(obj['busState']  === 'EN_ROUTE') acc['On Route'] += 1
            if(obj['busFare']) acc['Collected'] += Number(obj['busFare'])
            if(obj['totalFare']) acc['Fare'] += Number(obj['totalFare'])

          } 
          return acc         
        }, {
          'Total Buses': 0,
          'Arrived': 0,
          'On Route': 0,
          'Collected': 0,
          'Fare': 0
      })
    setBusInfo({
      'Total Buses': updateBusCard['Total Buses'],
      'Arrived': updateBusCard['Arrived'],
      'On Route': updateBusCard['On Route']
    })

    setFinance({
      'Fare Collected': updateBusCard['Collected'],
      'Total Bus Fare': updateBusCard['Fare']
    })

    const updatePeopleCard = allBus.reduce((acc:Record<string, number>, obj:Record<string, string>) => {
          if(acc){
            if(obj['busState']  === 'ARRIVED') acc['Arrived'] += Number(obj['totalPeople'])
            if(obj['busState']  === 'EN_ROUTE') acc['On Route'] += Number(obj['totalPeople'])
            if(obj['totalPeople']) acc['People'] += Number(obj['totalPeople'])
          } 
          return acc         
        }, {
        'People': 0,
        'Arrived': 0,
        'On Route': 0,
      })
    setPeopleInfo(updatePeopleCard)
  }

  const refreshData = () => {
    getBus()
  }
  
  useEffect(() => {
    updateCard()
  }, [allBus])

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
          <Box maxW={"500px"} w="350px">
            <Flex align={"right"} direction={"row"} alignItems={"flex-end"} mt={6} mb={3} justify="space-between">
              <Box
                as={Button}
                bg={"green.500"}
                color="white"
              >
                Refresh
              </Box>
              <Link href="busing-admin/statistics">
                <Text color="gray.600">Statistics</Text>
              </Link>
            </Flex>
            <Flex
              justify="space-between"
              gap={4}
            >
              <Box flex={1}  bg="gray.100" rounded={"md"} p={4}>
                <Text fontWeight={600} color="gray.500" fontSize={15} mb={2}>Bus Info</Text>
                {loading ?<Flex w="100%" h="100%" justify={"center"} align="center">
                  <Spinner />
                </Flex> : Object.keys(busInfo).map(item => (
                  <Flex align="center" justify={"space-between"} key={item}>
                    <Text fontSize={14}>
                      {item}
                    </Text>
                    <Box fontWeight={600} p={1} fontSize={14} rounded={"md"}>
                      {busInfo[item]}
                    </Box>
                  </Flex>))
                }
              </Box>

              <Box flex={1}  bg="gray.100" rounded={"md"} p={4}>
                <Text fontWeight={600} color="gray.500" fontSize={15} mb={2}>People Info</Text>
                {loading ?<Flex w="100%" h="100%" justify={"center"} align="center">
                  <Spinner />
                </Flex> :Object.keys(peopleInfo).map(item => (
                  <Flex align="center" justify={"space-between"} key={item}>
                    <Text fontSize={14}>
                      {item}
                    </Text>
                    <Box fontWeight={600} p={1} fontSize={14} rounded={"md"}>
                      {peopleInfo[item]}
                    </Box>
                  </Flex>))
                }
              </Box>
            </Flex>

            <Box flex={1}  bg="gray.100" rounded={"md"} p={4} mt={3}>
                <Text fontWeight={600} color="gray.500" fontSize={15} mb={2}>Finance Summary</Text>
                {loading ?<Flex w="100%" h="100%" justify={"center"} align="center">
                  <Spinner />
                </Flex> : Object.keys(finance).map(item => (
                  <Flex align="center" justify={"space-between"} key={item}>
                    <Text fontSize={14}>
                      {item}
                    </Text>
                    <Box fontWeight={600} p={1} fontSize={14} rounded={"md"}>
                      Ghc {finance[item]}
                    </Box>
                  </Flex>))
                }
              </Box>


            <Box mt={4}>
            <Flex justify={"space-between"} flexDirection="row">
              <Text fontSize={15} fontWeight={700}>
                Busing groups
              </Text>
              <Text fontWeight={700}>{allGroups.length}</Text>
            </Flex>

              {allGroups.map((item : Record<string, string>) => <Box
                key={item._id as string}
                borderWidth={1}
                borderColor={"gray.200"}
                rounded="md"
                mb={4}
                bg="blue.400"
                overflow={"hidden"}
                onClick={() => setSelected(item._id as string)}
              >
                <Flex align="center" justify={"space-between"} p={2}>
                  <Text fontSize={15} fontWeight={700} color="white">
                    {item.groupName}
                  </Text>
                  <Box
                    fontWeight={600}
                    p={1}
                    fontSize={14}
                    rounded={"md"}
                    color="white"
                  >
                    {allBus.filter((bus: Record<string, string>) => bus.busGroup === item._id).length || 0} Buses
                  </Box>
                </Flex>
                
                {selected === item._id && <Box>
                  {allBus
                  .filter((bus: Record<string, string>) => bus.busGroup === item._id)
                  .map((l: Record<string, string>, i: number) =>                   
                  <Box key={l._id } bg="blue.200" p={2} borderBottomWidth={1} borderBottomColor="blue.400" pb={3}>
                    <Flex justify={"space-between"}>
                      <Text fontWeight={600} fontSize={14} textTransform="capitalize">Bus #{i+1} {l.busRep}</Text>
                      <Text fontSize={13} fontWeight={600} color="gray.600">
                        {l.busState === 'ARRIVED' ? 'Arrived' : 'On Route'}
                      </Text>
                    </Flex>
                    <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
                      <Flex flex={1} justify={"space-between"}>
                        <Text fontWeight={600}>Start Time</Text>
                        <Text>{moment(l.created_on).format('h: mm a')}</Text>
                      </Flex>
                      <Flex flex={1} justify={"space-between"}>
                        <Text fontWeight={600}>End Time</Text>
                        <Text>{moment(l.arrivalTime).format('h: mm a')}</Text>
                      </Flex>
                    </Flex>
                    <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
                      <Flex flex={1} justify={"space-between"}>
                        <Text fontWeight={600}>People</Text>
                        <Text>{l.totalPeople}</Text>
                      </Flex>
                      <Flex flex={1} justify={"space-between"}>
                        <Text fontWeight={600}>Fare</Text>
                        <Text>Ghc {`${l.busFare} ${l.totalFare ? '/ '+l.totalFare: ''}`}</Text>
                      </Flex>
                    </Flex>
                  </Box>)}
                </Box>}
              </Box>)}
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  );
}