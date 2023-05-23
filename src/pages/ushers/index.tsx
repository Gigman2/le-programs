import Head from 'next/head'
import { useState , useEffect} from 'react'
import Image from 'next/image'
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getUser } from '@/utils/auth'
import moment from 'moment'

export default function Home() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{name?: string}>({})
  const [loading, setLoading] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const [headCounts, setHeadCounts] = useState<Record<string, string | number | Record<string, string>>[]>([])

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
            setHeadCounts(data)
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
              {headCounts.map(item =>  <Box key={item._id as string} p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={4}>
                    <Flex align="center" justify={"space-between"}>
                        <Text fontSize={15} fontWeight={700} color="gray.600">Total <Text as="span">{item.total as string}</Text></Text>
                        <Text fontSize={15} fontWeight={700} color="gray.600">{moment(item.created_on as string).format('h: mm A')}</Text>
                    </Flex>
                    <Flex  mt={2} align={"center"} borderBottomWidth={1} borderColor="gray.200" my={1}>
                      <Text fontSize={14} mr={2}>Recorded by </Text>
                      <Text fontWeight={600} textTransform={'capitalize'}>{item.recorder as string}</Text>
                    </Flex>
                    <Grid templateColumns="repeat(3,1fr)" columnGap={12} rowGap={3}>
                      {Object.keys(item.section).map((s: string) => (
                        <Flex key={s} mr={3} align="center" justify={"space-between"}>
                          <Text fontSize={13} mr={2} textTransform={'capitalize'}>{s}</Text> 
                          <Text fontWeight={600}>{(item.section as Record<string, string>)?.[s]}</Text>
                      </Flex>
                      ))}
                    </Grid>
                </Box>)}
               
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}