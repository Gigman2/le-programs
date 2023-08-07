/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { addBus, getUser } from '@/utils/auth'
import { IMember } from '@/utils/interfaces'
import { useRouter } from 'next/router'
import {getAttendeePostApi} from "@frontend/apis";

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<IMember[]>([])
  const [currentUser, setCurrentUser] = useState<{name?: string; group?: string; groupName?: string}>({})
  const [loading, setLoading] = useState(false)

    const fetchAttendees = async () => {
      try {
          const reqData = {group: currentUser.group}
          const res = await getAttendeePostApi(reqData)
          const groups = await res.json()
          let groupData = (groups.data || []) as IMember[]
          setData(groupData)
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(() => {
      if(currentUser){
        fetchAttendees()
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
          <Box maxW={"500px"} w="100%" p={2}>
            <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2} rounded="md">
                <Box>
                  <Text fontWeight={600} fontSize={14}>Group: {currentUser.groupName}</Text>
                  <Text fontWeight={600} fontSize={13} color="gray.400">{currentUser.name}</Text>
                </Box>
                <Box
                  as={Button} 
                  bg="base.blue" 
                  color="white" 
                  fontWeight={500} 
                  _hover={{bg: "base.blue"}} 
                  fontSize={12}
                  onClick={() => router.push('shepherd/add')}
                  >Add member</Box>
          </Flex>

          {loading ? <Flex h={48} w="100%" justify={"center"} align="center">
            <Spinner color='gray.300' width={12} h={12} />
          </Flex> :           <Box mt={4}>
              {data.map(item => (<Box key={item._id} p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={2} mt={2}>
                  <Flex align="center" justify={"space-between"}>
                      <Text fontSize={15} fontWeight={700} color="gray.600">{`${item.details.surname} ${item.details.otherName}`}</Text>
                      <Text fontSize={14} color="gray.500" mt={1} bg="gray.200" py={1} px={2} rounded="md">{item.details.position}</Text>
                  </Flex>
                  <Text fontSize={14} fontWeight={500} color="gray.600">{item.details.phoneNumber}</Text>
              </Box>))}
          </Box>}

          </Box>
        </Flex>
      </main>
    </>
  )
}
