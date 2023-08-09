/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import _,{ 
  groupBy

 } from 'lodash';
import { getUser } from "@/utils/auth";
import { useRouter } from "next/router";
import {addBusRoundsApi} from "@frontend/apis";


export default function OverView() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name?: string}>({})
  const router = useRouter()


  const getBusRound = async () => {
    try {
      if(!loading){
        setLoading(true)
        const apiPayload = { 
          busGroup : { $exists: true, $ne: null } 
        }
        const res = await addBusRoundsApi(apiPayload)
        const response = await res.json()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
    getBusRound()
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
        <Box maxW={"500px"} w="500px" mx={"auto"} pt={2}>
          <Flex justifyContent={"space-between"} align="center" borderBottomWidth={1} pb={1}>
              <Text fontSize={16} color="gray.600" fontWeight={600}>Main Admin</Text>
              <Text fontSize={16} color="gray.600" fontWeight={600} textTransform={"capitalize"}>{currentUser.name}</Text>
          </Flex>
          <Flex w="100%" justify={"center"}>
              <Box maxW={"500px"} w="500px" mt={5}>
                  <Flex justifyContent={"space-between"} align="center"  pb={1}>
                      <Text fontSize={16} color="gray.500" fontWeight={600}>{moment().format('LLL')}</Text>
                      <Box as={Button}
                      bg="blue.400" color="white" 
                      rounded={"md"} px={4} 
                      py={2} fontSize={14}  
                      _hover={{bg: 'blue.500'}}
                      onClick={() => router.push('oversee-admin/schedule-event')}>Schedule Event</Box>
                  </Flex>
              </Box>
          </Flex>
          <Box p={4} borderWidth={1} mt={4} rounded={"md"}>
            <Flex justify={"space-between"} pb={3} borderBottomWidth={1}>
              <Text color="gray.500" fontSize={14}>Mega Gathering Service </Text>
              <Box bg="green.100" px={3} rounded={"md"} fontSize={13}>
                <Text fontWeight={500} fontSize={14} color={"green.400"}>Active</Text>
              </Box>
            </Flex>
            <Box pt={3}>
              <Flex justify={"space-between"}>
                <Text fontSize={14}>Start: <Text as="span" fontWeight={600}>9: 01AM</Text></Text>
                <Text fontSize={14}>End: <Text as="span" fontWeight={600}>1: 00PM</Text></Text>
              </Flex>
              <Box rounded={"sm"} overflow={"hidden"} fontSize={14} color={"gray.600"} my={2} bg={'gray.100'}>
                <Text bg="gray.200" p={1}>Head Count</Text>
                <Flex justify={"space-between"} p={1}>
                  <Text>First count: <Text as="span" fontWeight={600}>121</Text></Text>
                  <Text>Last count: <Text as="span" fontWeight={600}>32</Text></Text>
                  <Text>Final count: <Text as="span" fontWeight={600}>221</Text></Text>
                </Flex>
              </Box>
              <Box rounded={"sm"} overflow={"hidden"} fontSize={14} color={"gray.600"} my={2} bg={'gray.100'}>
                <Text bg="gray.200" p={1} >Busing</Text>
                <Flex justify={"space-between"} p={1}>
                  <Text>People: <Text as="span" fontWeight={600}>213</Text></Text>
                  <Text>Buses: <Text as="span" fontWeight={600}>12</Text></Text>
                  <Text>Offering: <Text as="span" fontWeight={600}>221</Text></Text>
                </Flex>
              </Box>
               <Box rounded={"sm"} overflow={"hidden"} fontSize={14} color={"gray.600"} my={2} bg={'blue.100'}>
                <Text bg="blue.200" p={1} >Summary</Text>
                <Flex justify={"space-between"} p={1}>
                  <Text>Headcount Change: <Text as="span" fontWeight={600}>12</Text></Text>
                  <Text>Busing Change: <Text as="span" fontWeight={600}>12</Text></Text>
                  <Text>--: <Text as="span">--</Text></Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}
