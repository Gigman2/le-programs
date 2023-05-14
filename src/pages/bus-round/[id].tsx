/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, Button, Flex, FormLabel, Icon, Input, Text, useToast } from '@chakra-ui/react'
import {BsArrowLeft} from 'react-icons/bs'
import { useRouter } from 'next/router'
import moment from 'moment'
import { addBus, getUser } from '@/utils/auth'
import { handleChange, validate } from '@/utils/form'
import Autocomplete from '@/components/Forms/Autocomplete'

export default function BusMembers() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [userBus, setUserBus] = useState<Record<string, string>>()
  const [stations, setStations] = useState<Record<string, string>[]>([])
  const [currentUser, setCurrentUser] = useState<{
    name?: string; 
    group?: string; 
    groupName?: string; 
    groupStations?: string[]
  }>({})

  const toast = useToast()
  const [fields, setFields] = useState({
    totalFare: '',
    totalPeople: '',
    busFare: '',
    currentStation: ''
  })

  const [errors, setErrors] = useState<Record<string, string | undefined>>({
    totalFare: undefined,
    totalPeople: undefined,
    busFare: undefined,
    currentStation: undefined
  })

  const { id } = router.query
  const fetchData = async (busId: string) => {
    try {
      if(!loading){
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/bus_rounds/getBusRounds/${busId}`, {
          method: 'get',
        })
        const response = await res.json()
        let recorderRound = response.data
        setUserBus(recorderRound)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const endRound = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/bus_rounds/updateBusRounds/${id}`, {
        method: 'post',
        body: JSON.stringify({busState: "ARRIVED", arrivalTime: new Date() })
      })
      const response = await res.json()
      let recorderRound = response.data
      setUserBus(recorderRound)
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  const toastMessage: { 
        title: string; 
        status: "success" | "loading" | "error" | "info" | "warning" | undefined; 
        duration: number; 
        isClosable: boolean; 
        position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' |'bottom-left'
    } = {
      title: "Bus updated successfully",
      status: "success",
      position: 'top-right',
      duration: 9000,
      isClosable: true,
  }
  
  const updateBus = async () => {
    try {
      const payload = {...fields}
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/bus_rounds/updateBusRounds/${id}`, {
        method: 'post',
        body: JSON.stringify(payload)
      })
      const response = await res.json()
      let recorderRound = response.data
      setUserBus(recorderRound)
    } catch (error) {
      toastMessage.title = 'An error occurred'
      toastMessage.status = 'error'
    } finally{
      toast(toastMessage)
      setLoading(false)
    }
  }

  useEffect(() => {
    const notValid = validate(['totalPeople', 'busFare'], errors, fields, setErrors)
    setHasError(notValid)
  }, [fields])

  useEffect(() => {
    if(userBus){
      addBus(userBus?._id)
      setFields({
        totalFare: userBus.totalFare,
        totalPeople: userBus.totalPeople,
        busFare: userBus.busFare,
        currentStation: userBus.currentStation
      })
      setSearch(userBus.currentStation)
    }
  }, [userBus])

  useEffect(() => {
    fetchData(id as string)
  }, [id])

  useEffect(() => {
    if(currentUser.groupStations){
      const newStations: Record<string, string>[] = currentUser.groupStations.map(item => ({label: item, value: item}))
      setStations(newStations)
    }
  }, [currentUser])

  useEffect(() => {
    const user = getUser()
    console.log(user)
    setCurrentUser(user)
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
          <Box maxW={"500px"} w="100%" pt={4} px={4} >
            <Flex justify={"space-between"}>
              <Text fontWeight={600}>Started at {moment(userBus?.created_on).format('h:mm a')}</Text>
              {userBus?.busState === 'ARRIVED' 
              ? 
                <Text fontWeight={600}>Arrived at {moment(userBus?.arrivalTime).format('h:mm a')}</Text> :
                <Box
                  as={Button} fontSize={12} 
                  bg="green.500" 
                  _hover={{bg:"green.500"}}
                  _focus={{bg:"green.500"}} 
                  color="white"
                  onClick={() => endRound()}
                >End Round</Box>
              }
              
            </Flex>

            <Box mt={8}>
              <Flex justifyContent={"space-between"} align="center">
                <Flex fontSize={14} 
                  onClick={() => router.push('/bus-round')}
                  align={"center"} 
                  mb={3} 
                  bg="gray.200" 
                  p={1} 
                  rounded={"sm"} 
                  color="gray.500" 
                  cursor={"pointer"}>
                    <Icon as={BsArrowLeft} mr={1}/> Back
                  </Flex>
              </Flex>
              <Box mt={4}>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2}>
                  <FormLabel fontSize={14}>How much are you to pay for the bus</FormLabel>
                  <Input 
                      type={"text"}
                      name="totalFare"
                      placeholder='Enter here ...' 
                      value={fields.totalFare} 
                      onChange={(v) => handleChange(v?.currentTarget?.value, 'totalFare', fields, setFields)} 
                  />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2}>
                  <FormLabel fontSize={14}>How many people do you have in the bus</FormLabel>
                  <Input 
                      type={"text"}
                      name="totalPeople"
                      placeholder='Enter here ...' 
                      value={fields.totalPeople} 
                      onChange={(v) => handleChange(v?.currentTarget?.value, 'totalPeople', fields, setFields)} 
                  />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                  <FormLabel fontSize={14}>How much fare were you able to collect</FormLabel>
                  <Input 
                      type={"text"}
                      name="busFare"
                      placeholder='Enter here ...' 
                      value={fields.busFare} 
                      onChange={(v) => handleChange(v?.currentTarget?.value, 'busFare', fields, setFields)} 
                  />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                  <FormLabel fontSize={14}>What is your current / last station</FormLabel>
                  <Autocomplete 
                      name='currentStation'
                      noMatch={item => null}
                      data={stations}
                      fields={fields as unknown as Record<string, string>}
                      setFields={setFields as unknown as React.Dispatch<React.SetStateAction<Record<string, string | boolean | undefined >>>}
                      placeholder='Enter group name here ...'
                      queryValue={(query) => null }
                      search={search}
                      setSearch={setSearch}
                  />
                </Box>

                <Box as={Button} 
                    width="full" 
                    mt={8} 
                    mb={4}
                    bg="base.blue" 
                    color="white" 
                    _hover={{bg: "base.blue"}}
                    _focus={{bg: "base.blue"}}
                    _active={{bg: "base.blue"}}
                    isLoading={loading}
                    isDisabled={hasError}
                    onClick={(v) => updateBus()} 
                    >Save
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}
