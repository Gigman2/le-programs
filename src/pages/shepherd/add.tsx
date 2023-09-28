/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Box, Button, Flex, FormLabel, Icon, Input, Text, useToast } from '@chakra-ui/react'
import {BsArrowLeft} from 'react-icons/bs'
import { useRouter } from 'next/router'
import { getUser } from '@/utils/auth'
import PersonalInfo from '@frontend/components/AddMember/Personalnfo'
import OtherInfo from '@frontend/components/AddMember/OtherInfo'
import Professional from '@frontend/components/AddMember/Professional'
import NextOfKin from '@frontend/components/AddMember/NextOfKin'
import Church from '@frontend/components/AddMember/ChurchInfo'
import { validate } from '@/utils/form'
import { IMember } from '@/utils/interfaces'
import {addAttendeeInfoApi, getAttendeeInfoApi} from "@frontend/apis";


export default function BusMembers() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<number>(1)
    const [disabled, setDisabled] = useState(false)
    const [attendeeData, setAttendeeData] = useState<{label: string, value: string}[]>([])
    const [search, setSearch] = useState<string>('')

    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<{name?: string; group?: string; bus?: string}>({})

    const toast = useToast()
    const toastMessage: { 
        title: string; 
        status: "success" | "loading" | "error" | "info" | "warning" | undefined; 
        duration: number; 
        isClosable: boolean; 
        position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' |'bottom-left'
    } = {
            title: "Member added successfully",
            status: "success",
            position: 'top-right',
            duration: 9000,
            isClosable: true,
    }

    const [fields, setFields] = useState<Record<string, string | boolean | undefined>>({})

    const [errors, setErrors] = useState<Record<string, string | undefined>>({})

    const resetData = () => {
        const fieldsValue = {...fields}
        Object.keys(fieldsValue).map(item => fieldsValue[item] = '')
        setFields(fieldsValue)
        setSearch('')
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const payload: Record<string, string | boolean | Record<string, string | boolean>> = {}
            payload.addedBy = currentUser.name as string
            payload.group = currentUser.group as string
            payload.details = {...fields} as Record<string, string | boolean>
            let res = await addAttendeeInfoApi(payload)
            let resData = await res.json()
            if(res.status !== 200) throw new Error(resData.message)
            toast(toastMessage)
            setLoading(false)
            resetData()
        }  catch (error) {
            toastMessage.title = 'An error occurred'
            toastMessage.status = 'error'
            toast(toastMessage)
            setLoading(false)
        } 
    }

    const fetchAttendees = async () => {
        try {
            const res = await getAttendeeInfoApi()
            const groups = await res.json()
            let groupData = (groups.data || []) as IMember[]
            const parseData = groupData.map(item => ({label: item._id, value: item.details.surname+' '+ item.details.otherName})) as {label: string, value: string}[]
            setAttendeeData(parseData)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const user = getUser()
        setCurrentUser(user)
        fetchAttendees()
    }, [])

    const componentProps = {
        fields,
        setFields,
        errors,
        setErrors,
        step,
        setStep
    }

    const sectionValidations: Record<number, string[]> = {
        1: ['surname', 'email', 'phoneNumber'],
        2: ['dob', 'maritalStatus'],
        3: [],
        4: [],
        5: []
    }

    const renderComponent = () => {
        switch (step) {
            case 1:
                return <PersonalInfo {...componentProps}/>
            case 2:
                return <OtherInfo {...componentProps}/>
            case 3:
                return <Church {...componentProps}/>
            case 4:
                return <Professional {...componentProps}/>
            case 5:
                return <NextOfKin {...componentProps}/>
        
             default:
                return res.status(405).json({ message: "Method not allowed" });
        }
    }

    useEffect(() => {
        const hasError = validate(sectionValidations[step], errors, fields, setErrors)
        setDisabled(hasError)
    }, [fields])


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
            <Box maxW={"500px"} w="100%" px={2} pt={4}>
                <Flex justify={"space-between"}>
                    <Flex 
                    onClick={() => router.push('/shepherd')}
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
                    <Text  fontWeight={600}>
                            <Text as="span" color="gray.500" transform={"capitalize"}>Name </Text> 
                        {currentUser.name}
                    </Text>
                </Flex>
                
                <Box mt={4}>
                    {renderComponent()}
                </Box>

                <Flex gap={12}>
                    <Box as={Button} 
                        width="full" 
                        mt={6} 
                        mb={4}
                        color="base.blue"
                        borderColor={"base.blue"}
                        borderWidth={2} 
                        isLoading={loading}
                        isDisabled={step <= 1}
                        onClick={(v) => setStep(step - 1)} 
                        >Previous
                    </Box>
                    <Box as={Button} 
                        colorScheme="black"
                        width="full" 
                        mt={6} 
                        mb={4}
                        bg="base.blue" 
                        color="white" 
                        _hover={{bg: "base.blue"}}
                        _focus={{bg: "base.blue"}}
                        _active={{bg: "base.blue"}}
                        isLoading={loading}
                        isDisabled={disabled || step > 5}
                        onClick={(v) => step === 5 ? handleSubmit() : setStep(step + 1)} 
                        >{step === 5 ? 'Save' : 'Next'}
                    </Box>
                </Flex>
            </Box>
            </Flex>
        </main>
        </>
    )
}
