/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { Box, Button, Flex, FormLabel, Icon, Input, Text, useToast } from '@chakra-ui/react'
import { IAccountUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbChevronLeft} from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { handleChange } from '@/utils/form'
import Autocomplete from '@/frontend/components/Forms/CustomSelect'
import { CreateBusTrip, CreateBusTripDTO } from '@/frontend/apis/bus'
import { IBusRound } from '@/interface/bus'

export default function AddBusLog() {
    const [currentUser, setCurrentUser] = useState<IAccountUser>()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const router = useRouter()
    const toast = useToast()
    const [fields, setFields] = useState({
        busOffering: 0,
        totalPeople: 0,
        busCost: 0
    })

    const createBus = async () => {
        try {
            setLoading(true)
            const payload: CreateBusTripDTO = {...fields}
            const res: any = await CreateBusTrip(payload)
            if(res){
                let  resData: IBusRound = res?.data as any
                console.log('Data ', resData)
                
            }
        } catch (error) {
            setLoading(false)
            const _error = error as any
            toast({
                status: "error",
                duration: 2000,
                position: 'top-right',
                isClosable: true, 
                title: _error?.response?.data?.error || _error.message || 'Error occurred'
            })
        }
    }



  return (
    <GuardWrapper allowed={['BUS_REP']} redirectTo='/bus/login' app='bus'>
      <PageWrapper>
        <Box maxW={"500px"} w="100%" position={"relative"} mt={8}>
                <Flex gap={4}>
                    <Flex px={3} py={4} align={"center"} rounded={"md"} bg="gray.200" h={14} cursor={"pointer"}
                        onClick={() => router.back()}
                    >
                        <Icon as={TbChevronLeft} fontSize={32} color={"gray.500"} />
                    </Flex>
                    <Box textAlign={"center"} p={4} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
                        Creating a new bus trip
                    </Box>
                </Flex>
                <Flex justify={"space-between"} mt={2}>
                    <Box>
                        <Text color={"gray.500"} lineHeight={1.2}>Trip started at</Text>
                        <Text fontWeight={600} color={"gray.600"}>9:32 am</Text>
                    </Box>
                </Flex>

                <Box mt={4}>
                    <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                        <FormLabel fontSize={14}>What is the cost of the bus fare?</FormLabel>
                        <Input 
                            type={"text"}
                            name="busCost"
                            placeholder='Enter here ...' 
                            value={fields.busCost} 
                            onChange={(v) => handleChange(v?.currentTarget?.value, 'busCost', fields, setFields)} 
                        />
                    </Box>

                    <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                        <FormLabel fontSize={14}>How many people do you have in the bus</FormLabel>
                        <Input 
                            type={"text"}
                            name="totalPeople"
                            placeholder='Enter here ...' 
                            value={fields.totalPeople} 
                            onChange={(v) => handleChange(v?.currentTarget?.value, 'totalPeople', fields, setFields)} 
                        />
                    </Box>

                    <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                        <FormLabel fontSize={14}>How much offering were you able to collect</FormLabel>
                        <Input 
                            type={"text"}
                            name="busOffering"
                            placeholder='Enter here ...' 
                            value={fields.busOffering} 
                            onChange={(v) => handleChange(v?.currentTarget?.value, 'busOffering', fields, setFields)} 
                        />
                    </Box>

                    <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={2} mt={6}>
                        <Autocomplete 
                            label='Indicate the vehicle used for the trip'
                            name='vehicle'
                            data={[]}
                            fields={fields as unknown as Record<string, string>}
                            setFields={setFields as unknown as React.Dispatch<React.SetStateAction<Record<string, string | boolean | undefined >>>}
                            placeholder='Select vehicle'
                        />
                        
                    </Box>

                    <Box as={Button} 
                        width="full" 
                        mt={8} 
                        mb={4}
                        bg="base.blue" 
                        color="white" 
                        _hover={{bg: "base.blue"}}
                        _focus={{bg: "base.blue"}}
                        _active={{bg: "base.blue"}}
                        isLoading={loading}
                        isDisabled={hasError}
                        onClick={(v) => createBus()} 
                        >Create
                    </Box>
                </Box>
        </Box>
      </PageWrapper>
    </GuardWrapper>
  )
}
