/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/utils/auth'
import { useRouter } from 'next/router'
import { TbPlus } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'

const CardItem = ({name, value}: {name: string; value: string}) => {
  return (
    <Flex align={"center"} gap={3}>
      <Text fontSize={13} color={"gray.600"}>{name}</Text>
      <Text fontSize={14} fontWeight={600} color={"blackAlpha.700"}>{value}</Text>
    </Flex>
  )
}

const cardData = [
  [
    {name: "Started by", value: "Alex Ferguson"},
    {name: "Started on", value: "9:00 am"}
  ],
  [
    {name: "No of people", value: "98"},
    {name: "Ended on", value: "11:00 am"}
  ],
   [
    {name: "Offering Received", value: "Ghc 98"},
    {name: "Actual Cost", value: "Ghc 205"}
  ]
]

const BusCard = ({time, ended}: {time: string; ended: boolean}) => {
  return (
    <Box mb={8}>
        <Text fontSize={13} color={"gray.600"}>{time}</Text>
        <Box bg="gray.100" p={3} borderColor={"gray.200"} borderWidth={1} rounded={"md"}>
          <Flex justify={"space-between"} mb={2}>
            <Text color={"blackAlpha.700"} fontSize={13}>
              <Text as="span" fontWeight={600}>Bus 1</Text> | Currently at 
              <Text as="span" fontWeight={600} fontSize={14}> Oyarifa</Text>
            </Text>

            <Box 
              bg={ended ? "gray.500" : "white"} 
              color={ended ? "white" : "gray.500"} 
              px={4} rounded={"md"}
              borderWidth={ended ? 0 :1 }
              borderColor={"gray.500"}
            >
              {ended ? 'Arrived' : "En-Route"}
            </Box>
          </Flex>
          <Box w={"100%"} h={"1px"} bg="gray.300" />
          {cardData.map((item, i) => (
            <Flex key={`${i}`} mt={1} justify={"space-between"}>
              {item.map(
                card => (
                  <CardItem key={`${i}-${card.name}`} name={card.name} value={card.value} />
              ))}
            </Flex>
          ))}
        </Box>
    </Box>
  )}

export default function BusRepLogs() {
  const [userBus, setUserBus] = useState<Record<string, string>[]>([])
  const [nonActive, setNonActive] = useState(false)
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()

  useEffect(() => {
      setNonActive(true)
      if(userBus.length){
        const en_route = userBus.filter(item => item.busState === 'EN_ROUTE')
        if(en_route.length) setNonActive(false)
      }
    }, [userBus])

    useEffect(() => {
      const user = getUser() as IAccountUser
      if(!user) router.push('/bus/login')
      setCurrentUser(user)
    },[])

  return (
    <PageWrapper>
      <Box maxW={"500px"} w="100%">
        <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2} mt={4} rounded={"md"}>
            <Box>
              <Flex fontWeight={600} color={"gray.500"}>
                <Text color={"gray.500"}>{`${currentUser?.bus['BRANCH']?.name} , ${currentUser?.bus['ZONE']?.name}`}</Text>
              </Flex>
              <Text fontWeight={600} fontSize={14} color="gray.400" textTransform={"capitalize"}>Account Name: {currentUser?.name}</Text>
            </Box>
        </Flex>

        <Flex mt={4} align={"center"} justify={"space-between"}>
          <Text fontWeight={600} color="gray.500"> Mega Gathering Service</Text>
          <Flex align={"center"} bg="gray.600" gap={2} color={"white"} py={2} px={4} rounded={"md"}>
            <Icon as={TbPlus} fontSize={20} />
            Record Busing
          </Flex>
        </Flex>

        <Box mt={4}>
          <Box pos={"relative"} pl={4}>
            <Box left={0} pos={"absolute"} h={"100%"} w={2} rounded={"full"} bg="gray"></Box>
            <BusCard time={"Sun 1, October 9:31 AM"} ended={true} />
            <BusCard time={"Sun 14, October 10:01 AM"} ended={false} />
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  )
}
