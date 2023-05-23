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
            <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2}>
                <Box>
                  <Text fontWeight={600}>{currentUser.groupName}</Text>
                  <Text fontWeight={600} fontSize={13} color="gray.500">{currentUser.name}</Text>
                </Box>
                <Box 
                  as={Button} 
                  bg="base.blue" 
                  color="white" 
                  fontWeight={500} 
                  _hover={{bg: "base.blue"}}
                  _active={{bg: "base.blue"}}
                  _focus={{bg: "base.blue"}} 
                  fontSize={14}
                  onClick={() => addBusRound()}
                >Start Busing</Box>
            </Flex>


          <Box mt={4}>
              {loading ? 
                <Flex h={48} w="100%" justify={"center"} align="center">
                  <Spinner color='gray.300' width={12} h={12} />
                </Flex> 
                : (userBus || [])?.map((item, i) => ( 
                <Link href={`/bus-round/${item._id}`} key={item._id}>
                  <Box key={item._id} p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={4} bg="blackAlpha.900">
                      <Flex align="center" justify={"space-between"}>
                          <Text fontSize={15} fontWeight={700} color="white">Bus #{i + 1} at {moment(item?.created_on).format('h:mm a')}</Text>
                          {item.busState === 'ARRIVED' ?
                            <Box fontWeight={600} p={1} fontSize={14} rounded={'md'} color="orange.500">arrived</Box> :
                            <Box fontWeight={600} p={1} fontSize={14} rounded={'md'} color="green.500">on route</Box>
                          }
                      </Flex>
                      <Flex justify={"space-between"}>
                        <Text fontWeight={400} fontSize={14} color="white">People: {item.totalPeople || 0}</Text>
                        <Text fontWeight={400} fontSize={14} color="white">
                          {item.busState === 'ARRIVED' ? `Ghc ${item.busFare} ${item.totalFare ? 'out of '+ item.totalFare : ''}` : item.currentStation }
                        </Text>
                      </Flex>
                  </Box>
                </Link>))
              }
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}
