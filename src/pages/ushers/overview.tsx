import Head from 'next/head'
import { useState , useEffect} from 'react'
import Image from 'next/image'
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getUser } from '@/utils/auth'
import moment from 'moment'
import { IHeadcount } from '@/interface/headcount'

export default function Home() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{name?: string}>({})
  const [loading, setLoading] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [headCounts, setHeadCounts] = useState<IHeadcount[]>([])

  const defaultSections = ['behind choir', 'choir', 'mc Heads', 'behind mc', 'extreme main left', 'main left', 'main center', 'main right', 'extreme main right', 'media down', 'media top']

    const fetchData = async (user: {name: string}) => {
      try {
          if(!loading){
            setLoading(true)
            const recorderPage = {
              created_on: {
                $gt: moment().startOf('day').toDate(),
                $lt: moment().endOf('day').toDate(),
              },
            }
            const res = await fetch(`${baseUrl}/api/head_count/getHeadcount`, {
              method: 'post',
              body: JSON.stringify(recorderPage)
            })
            const response = await res.json()
            let data = (response.data || [])
            setHeadCounts(data.reverse())
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
    fetchData(user.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                <Text fontWeight={600} textTransform="capitalize">{currentUser.name}</Text>
                <Box 
                  as={Button} 
                  bg="base.blue" 
                  color="white" 
                  fontWeight={500} 
                  _hover={{bg: "base.blue"}} 
                  fontSize={14}
                  onClick={() => router.push('ushers/add')}
                >Add Headcount</Box>
            </Flex>

            <Box mt={4}>
              <Flex direction={"column"} gap={1} w="100%" borderWidth={2} borderColor={"black"} p={1}>
                <Flex align={"center"} justify={"center"} w="50%" bg="green.400" color={"white"} h="100px">
                  <Text>View 2</Text>
                </Flex>
                <Flex gap={1}>
                  <Flex direction={"column"} w="80%">
                    <Flex align={"center"} justify={"center"} w="100%" bg="orange.400" color={"white"} h="50px">
                      <Text>Office Complex</Text>
                    </Flex>
                    <Flex align={"center"} justify={"center"} w="100%" bg="purple.700" color={"white"} h="220px">
                      <Text>Auditorium</Text>
                    </Flex>
                  </Flex>
                  <Box w="20%" color={"white"}>
                    <Box h={"68px"} w="100%" bg="yellow.400"></Box>
                    <Box h={"68px"} w="100%" bg="pink.400"></Box>
                    <Box h={"67px"} w="100%" bg="green.400"></Box>
                    <Box h={"67px"} w="100%" bg="red.400"></Box>
                  </Box>
                </Flex>
                <Flex align={"center"} justify={"center"} w="100%" bg="green.400" color={"white"} h="130px">
                  <Text>View 2</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}