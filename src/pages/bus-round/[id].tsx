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
import Link from 'next/link'

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
      if(!loading && id ){
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/bus_rounds/${busId}`, {
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
      const res = await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
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
      const res = await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
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
            <Box maxW={"500px"} w="100%">
            <Box p={3} textAlign={"center"}>
            <Text color={"gray.600"} fontSize={18} textAlign={"center"}>Please login here instead</Text>
            <Text color='blue.400' fontSize={20} mt={4}>
              <Link href="https://workers-app.loveeconomychurch.org/bus/login">https://workers-app.loveeconomychurch.org/bus</Link>
            </Text>
           </Box>
          </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}
