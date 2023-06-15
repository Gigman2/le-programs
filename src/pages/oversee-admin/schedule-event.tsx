import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Button, Flex, Text, useToast, Icon, Grid, GridItem } from '@chakra-ui/react'
import { getUser } from '@/utils/auth'
import moment from 'moment'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router'
import CustomInput from '@/components/Forms/CustomInput'
import CustomDateTime from '@/components/Forms/CustomDateTime'
import CustomSelect from '@/components/Forms/CustomSelect'
import { MeetingTypes } from '@/helpers/misc';

export default function Home() {
    const router = useRouter()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<{name?: string;}>({})

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

    const [fields, setFields] = useState<Record<string, string | boolean | undefined>>({})
    const [errors, setErrors] = useState<Record<string, string | undefined>>({})

    const handleSubmit = async () => {
        try {
            setLoading(true)
            let res = await fetch(`${baseUrl}/api/attendee/addAttendee`, {
                method: 'post',
                body: JSON.stringify(fields)
            })
            let resData = await res.json()
            if(res.status !== 200) throw new Error(resData.message)
            toast(toastMessage)
            resetData()
            router.push('/oversee-admin')
        } catch (error) {
            toastMessage.title = 'An error occurred'
            toastMessage.status = 'error'
            toast(toastMessage)
        } finally{
             setLoading(false)
        }
    }

    
    const resetData = () => {
        const fieldsValue = {...fields}
        Object.keys(fieldsValue).map(item => fieldsValue[item] = '')
        setFields(fieldsValue)
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
          <Box maxW={"600px"} w="100%">
            <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2}>
                <Box>
                    <Text fontWeight={600} textTransform="capitalize">Schedule Event</Text>
                    <Text fontWeight={500} textTransform="capitalize" color="gray.500">{currentUser.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight={600}>{moment().format('Do MMM YYYY')}</Text>
                  <Text fontWeight={500} fontSize={14} color="gray.500" align={"left"}>{moment().format('h: mm A')}</Text>
                </Box>
            </Flex>

           <Box mt={4}>
              <Flex justify={"space-between"}>
                <Flex 
                    onClick={() => router.push('/oversee-admin')}
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
            <Box>
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="name" 
                    label="Event Name" 
                    placeholder='Name goes here ..' 
                />
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="venue" 
                    label="Venue" 
                    placeholder='Venue goes here ..' 
                />
                <Flex justify={"space-between"}>
                    <Box w="49%">
                        <CustomDateTime 
                            fields={fields} 
                            setFields={setFields} 
                            errors={errors} 
                            name="start"
                            time="startTime"
                            date="startDate" 
                            label="Start Date & Time" 
                        />
                    </Box>
                    <Box w="49%">
                        <CustomDateTime 
                            fields={fields} 
                            setFields={setFields} 
                            errors={errors} 
                            name="end"
                            time="endTime"
                            date="endDate" 
                            label="End Date & Time" 
                        />
                    </Box>
                </Flex>
                <CustomSelect
                    fields={fields} 
                    setFields={setFields} 
                    data={MeetingTypes} 
                    name="meetingType" 
                    label="Meeting Type" 
                    placeholder='Venue goes here ..' 
                    
                />
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