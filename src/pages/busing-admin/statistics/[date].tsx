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
import Link from "next/link";

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
          <Box maxW={"500px"} w="100%">
            <Box p={3} textAlign={"center"}>
              <Text color={"gray.600"} fontSize={18} textAlign={"center"}>Please login here instead</Text>
              <Text color='blue.400' fontSize={20} mt={4}>
                <Link href="https://workers-app.loveeconomychurch.org/bus">https://workers-app.loveeconomychurch.org/bus</Link>
              </Text>
            </Box>
          </Box>
        </Flex>
      </main>
    </>
  );
}