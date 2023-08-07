import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Button, Flex, FormLabel, Grid, Input, Text, useToast, Icon } from '@chakra-ui/react'
import { handleChange } from '@/utils/form'
import { getUser } from '@/utils/auth'
import moment from 'moment'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'
import {addHeadCountApi} from "@frontend/apis";

export default function Home() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{name?: string;}>({})
  const [sections, setSections] = useState<Record<string, number>>({
    'choir': 0,
    'behind choir': 0,
    'extreme main left': 0,
    'main left': 0,
    'main center': 0,
    'main right': 0,
    'extreme main right': 0,
    'behind mc': 0,
    'mc Heads': 0,
    'media top': 0,
    'media down': 0,
    'mothers lounge': 0,
    'miscellaneous': 0,
    'kids': 0
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
      const total = Object.keys(sections).reduce((acc, cur) => {
        acc += Number(sections[cur])
        return acc
      }, 0)
      const payload = {section: sections, total, recorder: currentUser.name}
      const res = await addHeadCountApi(payload)
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
    const data = {...sections}
    Object.keys(data).map(item => data[item] = 0)
    setSections(data)
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
              <Grid templateColumns="repeat(3,1fr)" columnGap={6} rowGap={3}>
                {Object.keys(sections).map(item => 
                  <Box key={item} borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
                    <FormLabel fontSize={14} textTransform="capitalize">{item}</FormLabel>
                    <Input 
                        type={"text"}
                        name="firstName"
                        placeholder='Enter name here ...' 
                        value={sections[item]} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, item, sections, setSections)} 
                    />
                </Box>)}
              </Grid>
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