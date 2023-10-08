/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { getUser } from '@/utils/auth'
import Link from 'next/link'
import moment from 'moment'

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [userBus, setUserBus] = useState<Record<string, string>[]>([])
  const [nonActive, setNonActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{name?: string; group?: string; groupName?: string}>({})


  const fetchData = async (user: {name: string; group: string}) => {
    try {
      if(!loading){
        setLoading(true)
        const recorderPage = {
            busRep: user.name, 
            busGroup: user.group, 
            created_on: {
              $gt: moment().startOf('day').toDate(),
              $lt: moment().endOf('day').toDate(),
            }
        }
        const res = await fetch(`${baseUrl}/api/bus_rounds`, {
          method: 'post',
          body: JSON.stringify(recorderPage)
        })
        const response = await res.json()
        let recorderRound = (response.data || [])
        if(recorderRound.length){
          setUserBus(recorderRound)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const addBusRound = async () => {
    try {
      setLoading(true)
      const recorderPayload = {busRep: currentUser.name, nonBus: false, busState: 'EN_ROUTE', busGroup: currentUser.group}
      const createReq = await fetch(`${baseUrl}/api/bus_rounds/addBusRounds`, {
        method: 'post',
        body: JSON.stringify(recorderPayload)
      })
      const createRes = await createReq.json()
      let recorderRound = createRes.data
      setUserBus(prev => [...prev, recorderRound])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      setNonActive(true)
      if(userBus.length){
        const en_route = userBus.filter(item => item.busState === 'EN_ROUTE')
        if(en_route.length) setNonActive(false)
      }
    }, [userBus])

    useEffect(() => {
      const user = getUser()
      setCurrentUser(user)
      fetchData(user)
    },[])

  return (
    <>
      <Head>
        <title>Swollen Sunday | Love Economy Church</title>
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
  )
}
