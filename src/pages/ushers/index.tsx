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
  const [grouped, setGrouped] = useState<Record<string, number>>({})

  const sections: Record<string, string[]> = {
    'Overflow 1': ['Overflow 1'],
    'Overflow 2': ['Overflow 2'],
    'Overflow 3': ['Overflow 3'],
    'Overflow 4': ['Overflow 4'],
    'Auditorium': ['A', 'C1', 'C2', 'B', 'D1', 'D2', 'ext main left', 'main left', 'main center', 'main right', 'ext main right', 'media top'],
    'Annex': ['Annex 1', 'Annex 2', 'Annex 3'],
    'Back office': ['MCR', "Pastor's Lounge", "Mother's Lounge", "Finance", "Hallway", "Ushers", "kids"],
  }

  const groupData = (key: string, data: IHeadcount) => {
    const section = data.section
    const summary = Object.keys(section).filter(item => sections[key].includes(item)).reduce((acc, cur) => {
      acc += Number(section[cur])
      return acc
    }, 0)
    return summary
  }

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
                    <Flex gap={2} mb={2}>
                        {/* Overflow 1 */}
                        <Box w="15%">
                          <Flex direction={"column"} w="full" h="full" bg="green.200" rounded="md" overflow={"hidden"} p={2}> 
                            <Text fontWeight={600} fontSize={14} mb={2} >Ov 3</Text>
                            <Text fontWeight={600} fontSize={28} >{groupData('Overflow 3', item)}</Text>
                          </Flex>
                        </Box>

                        {/* Auditorium and Back office and Overflow 2 */}
                        <Box w="70%">
                            <Flex bg="green.200" rounded={"md"} mb={2} w="full" h={10} p={2} justify={"space-between"} alignItems={'center'}>
                              <Text fontWeight={600} fontSize={14} >Overflow 1</Text>
                              <Text fontWeight={600} fontSize={28} >{groupData('Overflow 2', item)}</Text>
                            </Flex>

                            {/* Back office */}
                            <Flex bg="orange.100" rounded={"md"} mb={2} w="full" h={10} p={2} justify={"space-between"} alignItems={'center'}>
                              <Text fontWeight={600} fontSize={14} >Back office</Text>
                              <Text fontWeight={600} fontSize={28} >{groupData('Back office', item)}</Text>
                            </Flex>
                            
                            {/* Auditorium */}
                            <Flex w="full" bg={"purple.200"} mb={2} rounded={"md"} h={20} p={2} justify={"space-between"} alignItems={'center'}>
                              <Text fontWeight={600} fontSize={14} >Auditorium</Text>
                              <Text fontWeight={600} fontSize={28} >{groupData('Auditorium', item)}</Text>
                            </Flex>

                            {/* Overflow 2 */}
                            <Flex w="full" bg={"green.200"} mb={2} rounded={"md"} h={10} p={2} justify={"space-between"} alignItems={'center'}>
                              <Text fontWeight={600} fontSize={14} >Overflow 2</Text>
                              <Text fontWeight={600} fontSize={28} >{groupData('Overflow 1', item)}</Text>
                            </Flex>
                        </Box>

                        {/* Over  */}
                        <Box w="15%">
                          <Flex direction={"column"} w="full" h="full"  bg="pink.200" rounded="md" overflow={"hidden"} p={2}>
                            <Text fontWeight={600} fontSize={14} mb={2} >Ann</Text>
                            <Text fontWeight={600} fontSize={28} >{groupData('Annex', item)}</Text>
                          </Flex>
                        </Box>
                    </Flex>
                    <Flex w="full" h={10} bg="green.200" rounded="md"  p={2} justify={"space-between"} alignItems={'center'}>
                      <Text fontWeight={600} fontSize={14} >Overflow 4</Text>
                      <Text fontWeight={600} fontSize={28} >{groupData('Overflow 4', item)}</Text>
                    </Flex>
                  </Box>
                  {/* <Grid mt={1} templateColumns="repeat(2,1fr)" py={2} columnGap={12} rowGap={0} borderTopWidth={1} borderColor={'gray.200'}>
                    {Object.keys(item.section).filter(key => !defaultSections.includes(key)).map((s: string) => (
                      <Flex key={s} mr={3} align="center" justify={"space-between"}>
                        <Text fontSize={13} mr={2} textTransform={'capitalize'}>{s}</Text> 
                        <Text fontWeight={600}>{(item.section as unknown as Record<string, string>)?.[s]}</Text>
                    </Flex>
                    ))}
                  </Grid> */}
              </Box>))}
          </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}