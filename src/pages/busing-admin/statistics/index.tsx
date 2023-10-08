/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Flex,
  Text,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import _ from 'lodash';
import { TbChevronDown } from "react-icons/tb";
import { IBusRound } from "@/interface/bus";
import MonthlyCard from "@/components/Busing/statistics/monthlyCard";
import Link from "next/link";

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
          <Box maxW={"500px"} w="100%">
            <Box p={3} textAlign={"center"}>
            <Text color={"gray.600"} fontSize={18} textAlign={"center"}>Please login here instead</Text>
            <Text color='blue.400' fontSize={20} mt={4}>
              <Link href="https://workers-app.loveeconomychurch.org/bus/login">https://workers-app.loveeconomychurch.org/bus</Link>
            </Text>
           </Box>
          </Box>
        </Flex>
      </main>
    </>
  );
}
