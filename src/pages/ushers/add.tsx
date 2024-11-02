import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Button, Flex, FormLabel, Grid, Input, Text, useToast, Icon, AccordionItem, Accordion, AccordionButton, AccordionPanel, AccordionIcon} from '@chakra-ui/react'
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
    'A': 0,
    'C1': 0,
    'C2': 0,
    'B': 0,
    'D1': 0,
    'D2': 0,
    'ext main left': 0,
    'main left': 0,
    'main center': 0,
    'main right': 0,
    'ext main right': 0,
    'media top': 0,
  })

  const [backOffice, setBackOffice] = useState<Record<string, number>>({
    'MCR': 0,
    "Pastor's Lounge": 0,
    "Mother's Lounge": 0,
    "Finance": 0,
    "Hallway": 0,
    "Ushers": 0,
    "kids": 0,
  })

  const [overflow, setOverflow] = useState<Record<string, number>>({
    "Overflow 1": 0,
    "Overflow 2": 0,
    "Overflow 3": 0,
  })

  const [annex, setAnnex] = useState<Record<string, number>>({  
    "Annex 1": 0,
    "Annex 2": 0,
    "Annex 3": 0,
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
      const data = {...auditorium, ...backOffice, ...overflow, ...annex}
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
    Object.keys(backOffice).map(item => backOffice[item] = 0)
    Object.keys(overflow).map(item => overflow[item] = 0)
    Object.keys(annex).map(item => annex[item] = 0)
    setAuditorium(auditoriumData)
    setBackOffice(backOffice)
    setOverflow(overflow)
    setAnnex(annex)
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
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton _expanded={{ bg: 'blue.500', color: 'white' }}>
                  <Box as="span" flex='1' textAlign={'left'} fontWeight={600} fontSize={18}>Add Count for Back Auditorium</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Box>
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
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton  _expanded={{ bg: 'blue.500', color: 'white' }}>
                  <Box as="span" flex='1' textAlign={'left'} fontWeight={600} fontSize={18}>Add Count for Back Office</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                <Box mt={4}>
                <Text fontWeight={600} fontSize={18} color={"gray.500"}>Back Office</Text>
                <Grid templateColumns="repeat(3,1fr)" columnGap={6} rowGap={3}>
                  {Object.keys(backOffice).map(item => 
                    <Box key={item} borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
                      <FormLabel fontSize={14} textTransform="capitalize">{item}</FormLabel>
                      <Input 
                          type={"text"}
                          name="firstName"
                          placeholder='Enter name here ...' 
                          value={backOffice[item]} 
                          onChange={(v) => handleChange(v?.currentTarget?.value, item, backOffice, setBackOffice)} 
                      />
                    </Box>)}
                    </Grid>
                  </Box>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton _expanded={{ bg: 'blue.500', color: 'white' }}>
                  <Box as="span" flex='1' textAlign={'left'} fontWeight={600} fontSize={18}>Add Count for Back Overflow</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                <Box mt={4}>
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
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton _expanded={{ bg: 'blue.500', color: 'white' }}>
                  <Box as="span" flex='1' textAlign={'left'} fontWeight={600} fontSize={18}>Add Count for Back Annex</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                <Box mt={4}>
                <Text fontWeight={600} fontSize={18} color={"gray.500"}>Overflow</Text>
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
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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