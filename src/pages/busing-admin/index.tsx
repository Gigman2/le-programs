/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { IBusRound } from "@/interface/bus";
import DeleteBusRound from "@/components/Modals/deleteBusRound";
import { useRouter } from "next/router";
import BusingAdmin from "@/components/Busing/Admin";

export default function OverView() {
  const [ data, setData ] = useState<any>({})
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [selectedBus, setSelectedBus] = useState<IBusRound>()
  const [loading, setLoading] = useState(false);
  const router = useRouter()

   const getSummary = async () => {
    try {
      if(!loading){
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/bus_rounds/bus-round-event`, {
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
        <DeleteBusRound isOpen={isOpen} onClose={onClose} bus={selectedBus as IBusRound}  getBus={getSummary}/>
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