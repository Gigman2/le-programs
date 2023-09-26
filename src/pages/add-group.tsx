import Head from 'next/head'
import { useState } from 'react'
import { Box, Button, Flex, FormLabel, Icon, Input, useToast } from '@chakra-ui/react'
import { TagsInput } from "react-tag-input-component";
import { handleChange } from '../utils/form'
import {BsArrowLeft} from 'react-icons/bs'
import { useRouter } from 'next/router';
import {addBusGroupApi} from "@frontend/apis";


export interface IGroup {
    groupName: string,
    busReps: string[],
    stations: string[],
    totalBuses: number,
    busRound: boolean
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<IGroup>({
    groupName: '',
    busReps:  [],
    stations: [],
    totalBuses: 0,
    busRound: true
  })
  const toast = useToast()
  const toastMessage: { 
    title: string; 
    status: "success" | "loading" | "error" | "info" | "warning" | undefined; 
    duration: number; 
    isClosable: boolean; 
    position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' |'bottom-left'
  } = {
        title: "Group added successfully",
        status: "success",
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      }

  const resetData = () => setFields({
     groupName: '',
    busReps:  [],
    stations: [],
    totalBuses: 0,
    busRound: true
  })
  
  const saveGroup = async () => {
    try {
      const payload = {...fields}
      payload.busReps = payload.busReps.map(item => item.toLowerCase())
      setLoading(true)
      let res = await addBusGroupApi(payload)
      let resData = await res.json()
      if(res.status !== 200) throw new Error(resData.message)
      resetData()
    } catch (error) {
      toastMessage.title = 'An error occurred'
      toastMessage.status = 'error'
    } finally {
      toast(toastMessage)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Swollen Sunday | Love Economy Church</title>
        <meta name="description" content="An app to record how God has blessed us with great increase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex w="100%" justify={"center"} mt={12}>
          <Box maxW={"500px"} w="300px">
            <Flex 
              onClick={() => router.push('/')}
              textAlign="center" 
              cursor="pointer"
              color="gray.600" 
              bg={'gray.300'} 
              rounded={"md"} 
              align="center"
              fontSize={14} 
              w={20} 
              mb={6} 
              py={1}
              px={2}>
                <Icon as={BsArrowLeft} fontSize={16} mr={1}/> 
                Home
            </Flex>

            <Box>
              <FormLabel fontSize={14} color="gray.700">Group Name</FormLabel>
              <Box rounded={"md"} overflow="hidden">
                <Input placeholder='Name here' 
                  value={fields.groupName}
                  onChange={v =>
                    handleChange(v?.currentTarget?.value, 'groupName', fields, setFields)
                  }
                />
              </Box>
            </Box>
            <Box mt={6}>
                <FormLabel fontSize={14} color="gray.700">Add Stations</FormLabel>
                <Box rounded={"md"} overflow="hidden">
                  <TagsInput
                        value={fields.stations}
                        onChange={val =>
                          handleChange(val, 'stations', fields, setFields)
                        }
                        name="stations"
                        placeHolder="enter stations"
                    />
                </Box>
            </Box>
            <Box mt={6}>
                <FormLabel fontSize={14} color="gray.700">Bus Reps</FormLabel>
                <Box rounded={"md"} overflow="hidden">
                  <TagsInput
                        value={fields.busReps}
                        onChange={val =>
                          handleChange(val, 'busReps', fields, setFields)
                        }
                        name="busReps"
                        placeHolder="enter email"
                    />
                </Box>
            </Box>
            <Box mt={6}>
                <FormLabel fontSize={14} color="gray.700">Number of Buses</FormLabel>
                <Box h={20} w={20} borderWidth={1} borderColor={'gray.300'}  rounded={"md"} overflow="hidden">
                  <Input h="100%" fontSize={40} textAlign="center" value={fields.totalBuses} 
                    onChange={v =>
                      handleChange(v?.currentTarget?.value, 'totalBuses', fields, setFields)
                    } 
                  />
                </Box>
            </Box>

            <Box as={Button} width="full" mt={24} bg="base.blue" color="white" 
              _hover={{bg: "base.blue"}} 
              fontSize={16} 
              fontWeight={500}
              isLoading={loading}
              onClick={() => saveGroup()}
              >Add Group</Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}
