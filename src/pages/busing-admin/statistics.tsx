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
} from "@chakra-ui/react";
import moment from "moment";
import _ from 'lodash';

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
            <Box maxW={"500px"} w="350px" mt={5}>
                <Text fontWeight={600} color="gray.500" fontSize={15} mb={2}>Busing Statistics</Text>

                <Box  borderColor="gray.300" borderWidth={1} p={4} rounded="md" >
                    <Flex justify="space-between" w="100%" mb={2}>
                        <Text fontSize={14} color="gray.400">Total Busing Group</Text>
                        <Text fontWeight={600} color="gray.500" fontSize={14}>{Object.keys(allGroups).length}</Text>
                    </Flex>
                    <Flex justify="space-between" w="100%">
                        <Text fontSize={14} color="gray.400">Total Events</Text>
                        <Text fontWeight={600} color="gray.500" fontSize={14}>{Object.keys(allBus).length}</Text>
                    </Flex>
                </Box>

                {loading ? <Skeleton mt={4} height={24} rounded="md"></Skeleton> : <Box mt={4} borderWidth={1}  borderColor="gray.300"  p={3} rounded="md" >
                    <Grid 
                        columnGap={6} 
                        fontSize={13}
                        borderBottom={1}
                        borderColor={"gray.400"}
                        color="gray.500"
                        fontWeight={600}
                        templateColumns="repeat(12,1fr)" 
                    >
                        <Box as={GridItem}  colSpan={3} >Date</Box>
                        {Object.keys(allGroups).map(item => <Box key={item} mt={1} as={GridItem} colSpan={2} fontSize={8} fontWeight={600}>{allGroups[item] as string}</Box>)}
                        <Box as={GridItem} colSpan={1}>Total</Box>
                    </Grid>
                   {Object.keys(allBus).map(eventDate => (<Grid
                        key={eventDate} 
                        mt={3}
                        pt={2}
                        columnGap={6} 
                        fontSize={13}
                        color="gray.500"
                        borderTopWidth={1}
                        borderColor={"gray.200"}
                        templateColumns="repeat(12,1fr)" 
                    >
                        <Box as={GridItem} colSpan={3} fontSize={12} fontWeight={600}>{eventDate}</Box>
                       {Object.keys(allGroups).map(item => <Box key={item} as={GridItem} fontSize={12} colSpan={2}>{allBus[eventDate][item] || '--'}</Box>)}
                       <Box as={GridItem}>{Object.keys(allGroups).reduce((sum, curr)=> {

                          sum = sum + (allBus[eventDate][curr] || 0)
                          return sum
                       },0)}</Box>
                    </Grid>))}
                </Box>}
            </Box>
        </Flex>
      </main>
    </>
  );
}
