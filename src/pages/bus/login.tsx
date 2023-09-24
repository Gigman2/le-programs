/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { Box, Flex, Text, Icon } from '@chakra-ui/react'
import { useState } from 'react';
import {MdOutlineDirectionsBus} from 'react-icons/md'
import BacentaRep from '@/frontend/components/Accounts/bacentaRep';

export default function Home() {
    const [selected, setSelected] = useState<number>()

    return (
    <>
      <Head>
        <title>Swollen Sunday | Love Economy Church</title>
        <meta name="description" content="An app to record how God has blessed us with great increase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex w="100%" justify={"center"} mt={12}>
          <Box maxW={"500px"} w="100%" p={2} minH="100vh">
            <Flex 
                mb={4} 
                gap={4}
                borderWidth={1}
                borderColor={"gray.200"}
                rounded="md"
                align={"center"}
                p={5}
            >
                <Flex align={"center"} justify={"center"}>
                    <Icon as={MdOutlineDirectionsBus} color={"gray.600"} fontSize={52} />
                </Flex>
                <Flex 
                flex={1}
                direction={"column"} 
                align="left" 
                color="gray.500"
                >
                  <Text fontSize={18} fontWeight={600} textTransform={"uppercase"}>Love Economy Busing App</Text>
                  <Text>Login</Text>
              </Flex>
            </Flex>

           <BacentaRep />
          </Box>
        </Flex>

      </main>
    </>
  )
}
