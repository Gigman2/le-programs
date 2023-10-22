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

  const defaultSections = [
    'view 2', 'view 1', 'behind choir', 'choir', 'mc Heads', 'behind mc', 'ext main left 1', 'main left 1', 'main center 1', 'main right 1', 'ext main right 1',
    'media down', 'media top', 'ext main left 2', 'main left 2', 'main center 2', 'main right 2', 'ext main right 2', 'sick bay','born again room',
    'mother lounge 1', 'mother lounge 2', 'pastors lounge', 'audio room', 'office hallway'
  ]

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
                {headCounts.map(item =>  (<Box 
                  key={item._id as string} textAlign={'center'} fontWeight={600} color='gray.600' p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={8}>
                    <Flex align="center" justify={"space-between"}>
                        <Text fontSize={15} fontWeight={700} color="gray.600">Total <Text as="span" fontSize={20} ml={2}>{item.total as string}</Text></Text>
                        <Text fontSize={15} fontWeight={700} color="gray.600">{moment(item.created_on as string).format('h: mm A')}</Text>
                    </Flex>
                    <Flex  mt={2} align={"center"} borderBottomWidth={1} borderColor="gray.200" my={1}>
                      <Text fontSize={14} mr={2}>Recorded by </Text>
                      <Text fontWeight={600} textTransform={'capitalize'}>{item.recorder as string}</Text>
                    </Flex>
                    <Box mt={2}>
                      <Flex bg="orange.100" p={3} rounded={"md"} mb={2} w={"84%"}>
                        {Number(item.section['pastors lounge'] || 0) + Number(item.section['audio room'] || 0) + Number(item.section['office hallway'] || 0)}
                      </Flex>
                      <Flex gap={2} rounded={"md"}>
                        <Flex w="85%" bg={"purple.200"} direction={"column"} p={2} rounded={"md"}>
                          <Flex mb={3} justifyContent={'space-between'}>
                            <Flex gap={2}>
                              <Box w={20} px={2} py={0.5} borderColor={'gray.200'}  bg='green.100' borderWidth={1} rounded={'md'}>
                                {item.section['behind choir']}
                              </Box>
                              <Box w={20} px={2} py={0.5} borderColor={'gray.200'} bg='green.100' borderWidth={1} rounded={'md'}>
                                {item.section['choir']}
                              </Box>
                            </Flex>
                            <Flex gap={2}>
                              <Box w={16} px={2} py={1} borderColor={'gray.200'} bg='green.100' borderWidth={1} rounded={'md'}>
                                {item.section['mc Heads']}
                              </Box>
                              <Box w={14} px={2} py={1} borderColor={'gray.200'} bg='green.100' borderWidth={1} rounded={'md'}>
                                {item.section['behind mc']}
                              </Box>
                            </Flex>
                          </Flex>
                          <Flex gap={2}>
                            <Box flex={1} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['ext main left 1']}
                            </Box>
                            <Box flex={3} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main left 1']}
                            </Box>
                            <Box flex={5} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main center 1']}
                            </Box>
                            <Box flex={3} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main right 1']}
                            </Box>
                            <Box flex={1} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['ext main right 1']}
                            </Box>
                          </Flex>
                          <Flex gap={2} mt={2}>
                            <Box flex={1} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['ext main left 2']}
                            </Box>
                            <Box flex={3} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main left 2']}
                            </Box>
                            <Box flex={5} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main center 2']}
                            </Box>
                            <Box flex={3} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['main right 2']}
                            </Box>
                            <Box flex={1} px={2} py={1} borderColor={'gray.200'} bg='orange.100' borderWidth={1} rounded={'md'}>
                              {item.section['ext main right 2']}
                            </Box>
                          </Flex>
                          <Flex justify={'center'}>
                            <Box>
                              <Box w={20} my={2} px={2} py={1} bg={'gray.200'} rounded={'md'}>
                                {item.section['media top']}
                              </Box>
                            </Box>
                          </Flex>
                        </Flex>
                        <Flex direction={"column"} w="15%" borderWidth={1} borderColor={"gray.300"} bg="white.200" rounded="md" overflow={"hidden"}>
                          <Flex align={'center'} justify={"center"} w="100%" h="50%" p={2} bg="pink.200">
                            {Number(item.section['mothers lounge'] || 0) + Number(item.section['mother lounge 2'] || 0)}
                          </Flex>
                        </Flex>
                      </Flex>
                    </Box>
                    <Grid mt={1} templateColumns="repeat(2,1fr)" py={2} columnGap={12} rowGap={0} borderTopWidth={1} borderColor={'gray.200'}>
                      {Object.keys(item.section).filter(key => !defaultSections.includes(key)).map((s: string) => (
                        <Flex key={s} mr={3} align="center" justify={"space-between"}>
                          <Text fontSize={13} mr={2} textTransform={'capitalize'}>{s}</Text> 
                          <Text fontWeight={600}>{(item.section as unknown as Record<string, string>)?.[s]}</Text>
                      </Flex>
                      ))}
                    </Grid>
                </Box>))}
               
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}