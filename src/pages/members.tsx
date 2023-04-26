import Head from 'next/head'
import { useState } from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Box, Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import { TagsInput } from "react-tag-input-component";
import SearchBox from "react-search-box";

export default function Home() {
  const [selected, setSelected] = useState([]);
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
          <Box maxW={"500px"} w="300px">
            <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2}>
                <Text fontWeight={600}>Group Name</Text>
                <Box as={Button} bg="base.blue" color="white" fontWeight={500} _hover={{bg: "base.blue"}} fontSize={14}>Start Busing</Box>
            </Flex>

           <Box mt={4}>
                <Box p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={4}>
                    <Flex align="center" justify={"space-between"}>
                        <Text fontSize={15} fontWeight={700} color="gray.600">At 9:51 AM</Text>
                        <Box bg="green.100" p={1} fontSize={14} rounded={'md'} color="green.500">Opened</Box>
                    </Flex>
                    <Text fontWeight={400} fontSize={14}>Total: 24</Text>
                </Box>
                 <Box p={2} borderWidth={1} borderColor={"gray.200"} rounded="md" mb={4}>
                    <Flex align="center" justify={"space-between"}>
                        <Text fontSize={15} fontWeight={700} color="gray.600">At 7:51 AM</Text>
                        <Box bg="red.100" p={1} fontSize={14} rounded={'md'} color="red.500">Closed</Box>
                    </Flex>
                    <Text fontWeight={400} fontSize={14}>Total: 24</Text>
                </Box>
           </Box>
          </Box>
        </Flex>
      </main>
    </>
  )
}
