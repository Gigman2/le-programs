import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Button, Flex, FormLabel, Grid, Input, Text, useToast, Icon } from '@chakra-ui/react'
import { handleChange } from '@/utils/form'
import { getUser } from '@/utils/auth'
import moment from 'moment'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{name?: string;}>({})
  const [auditorium, setAuditorium] = useState<Record<string, number>>({
    'choir': 0,
    'behind choir': 0,
    'extreme main left 1': 0,
    'extreme main left 2': 0,
    'main left 1': 0,
    'main left 2': 0,
    'main center 1': 0,
    'main center 2': 0,
    'main right 1': 0,
    'main right 2': 0,
    'extreme main right 1': 0,
    'extreme main right 2': 0,
    'behind mc': 0,
    'mc Heads': 0,
    'media top': 0,
    'audio room': 0,
    'miscellaneous': 0,
    'pastors lounge': 0,
  })

  const [overflow, setOverflow] = useState<Record<string, number>>({
    'view 1': 0,
    'view 2': 0
  })

    const [annex, setAnnex] = useState<Record<string, number>>({
    'mother lounge 1': 0,
    'mother lounge 2': 0,
    'sick bay': 0,
    'born again room': 0
  })

    const toastMessage: { 
      title: string; 
      status: "success" | "loading" | "error" | "info" | "warning" | undefined; 
      duration: number; 
      isClosable: boolean; 
      position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' |'bottom-left'
    } = {
        title: "Headcount saved successfully",
        status: "success",
        position: 'top-right',
        duration: 9000,
        isClosable: true,
    }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const data = {...auditorium, ...annex, ...overflow}
      const total = Object.keys(data).reduce((acc, cur) => {
        acc += Number(data[cur])
        return acc
      }, 0)
      const payload = {section: {...data}, total, recorder: currentUser.name}
      const res = await fetch(`${baseUrl}/api/head_count/addHeadcount`, {
          method: 'post',
          body: JSON.stringify(payload)
      })
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

  const resetData = () => {
    const auditoriumData = {...auditorium}
    Object.keys(auditoriumData).map(item => auditoriumData[item] = 0)
    setAuditorium(auditoriumData)

    const annexData = {...annex}
    Object.keys(annexData).map(item => annexData[item] = 0)
    setAnnex(annexData)

    const overflowData = {...overflow}
    Object.keys(overflowData).map(item => overflowData[item] = 0)
    setOverflow(overflowData)
  } 

  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
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
                <Box>
                  <Text fontWeight={600}>{moment().format('Do MMM YYYY')}</Text>
                  <Text fontWeight={500} fontSize={14} color="gray.500" align={"left"}>{moment().format('h: mm A')}</Text>
                </Box>
            </Flex>

           <Box mt={4}>
              <Flex justify={"space-between"}>
                <Flex 
                onClick={() => router.push('/ushers')}
                textAlign="center" 
                cursor="pointer"
                color="gray.600" 
                bg={'gray.200'} 
                rounded={"md"} 
                align="center"
                fontSize={14} 
                w={24} 
                mb={6} 
                py={1}
                px={2}>
                    <Icon as={BsArrowLeft} fontSize={16} mr={1}/> 
                    Go Back
                </Flex>
            </Flex>
              <Box borderBottomWidth={2} borderColor={"gray.300"}>
                <Text fontWeight={600} fontSize={18} color={"gray.500"}>Auditorium</Text>
                <Grid templateColumns="repeat(3,1fr)" columnGap={6} rowGap={3}>
                  {Object.keys(auditorium).map(item => 
                    <Box key={item} borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
                      <FormLabel fontSize={14} textTransform="capitalize">{item}</FormLabel>
                      <Input 
                          type={"text"}
                          name="firstName"
                          placeholder='Enter name here ...' 
                          value={auditorium[item]} 
                          onChange={(v) => handleChange(v?.currentTarget?.value, item, auditorium, setAuditorium)} 
                      />
                  </Box>)}
                </Grid>
              </Box>
              <Box borderBottomWidth={2} borderColor={"gray.300"} mt={6}>
                <Text fontWeight={600} fontSize={18} color={"gray.500"}>Overflow</Text>
                <Grid templateColumns="repeat(3,1fr)" columnGap={6} rowGap={3}>
                  {Object.keys(overflow).map(item => 
                    <Box key={item} borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
                      <FormLabel fontSize={14} textTransform="capitalize">{item}</FormLabel>
                      <Input 
                          type={"text"}
                          name="firstName"
                          placeholder='Enter name here ...' 
                          value={overflow[item]} 
                          onChange={(v) => handleChange(v?.currentTarget?.value, item, overflow, setOverflow)} 
                      />
                  </Box>)}
                </Grid>
              </Box>
              <Box borderBottomWidth={2} borderColor={"gray.300"} mt={6}>
                <Text fontWeight={600} fontSize={18} color={"gray.500"}>Annex</Text>
                <Grid templateColumns="repeat(3,1fr)" columnGap={6} rowGap={3}>
                  {Object.keys(annex).map(item => 
                    <Box key={item} borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
                      <FormLabel fontSize={14} textTransform="capitalize">{item}</FormLabel>
                      <Input 
                          type={"text"}
                          name="firstName"
                          placeholder='Enter name here ...' 
                          value={annex[item]} 
                          onChange={(v) => handleChange(v?.currentTarget?.value, item, annex, setAnnex)} 
                      />
                  </Box>)}
                </Grid>
              </Box>
              <Box as={Button} 
                  width="full" 
                  mt={24} 
                  mb={4}
                  bg="base.blue" 
                  color="white" 
                  _hover={{bg: "base.blue"}}
                  _focus={{bg: "base.blue"}}
                  _active={{bg: "base.blue"}}
                  isLoading={loading}
                  isDisabled={loading}
                  onClick={(v) => handleSubmit()} 
                  >Save
              </Box>
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}