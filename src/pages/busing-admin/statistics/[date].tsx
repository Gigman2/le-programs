/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IBusRound } from "@/interface/bus";
import BusingAdmin from "@/components/Busing/Admin";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

export default function OverView() {
  const [ data, setData ] = useState<any>({})
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [selectedBus, setSelectedBus] = useState<IBusRound>()
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { date } = router.query;


   const getSummary = async () => {
    try {
      if(!loading){
        setLoading(true)
        let url = `${baseUrl}/api/bus_rounds/bus-round-event`
        if(date) url = url + `?date=${date}`

        console.log(url)
        const res = await fetch(`${url}`, {
          method: 'get',
        })
        const response = await res.json()
        let allBus = (response.data || [])
        setData(allBus)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSummary()
  }, [])

  return (
    <>
      <Head>
        <title>Love Economy Church | Swollen Sunday - admin </title>
        <meta name="description" content="An app to record how God has blessed us with great increase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex w="100%" justify={"center"}> 
          <Box minW={"500px"} w="350px" mt={4}>
            <Flex 
                    onClick={() => router.push('/busing-admin/statistics')}
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
            <BusingAdmin 
                loading={loading} 
                onOpen={onOpen} 
                setSelectedBus={setSelectedBus} 
                data={data}
            />
          </Box> 
        </Flex>
      </main>
    </>
  );
}