/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { Box, Flex, Text, Icon } from '@chakra-ui/react'
import { useState } from 'react';
import {MdOutlineDirectionsBus} from 'react-icons/md'
import BacentaRep from '@frontend/components/Accounts/bacentaRep';


export default function Home() {
    const [selected, setSelected] = useState<number>()

    const sections =[ 
    {
      name: 'Bacenta Rep',
      icon: MdOutlineDirectionsBus,
      id: 1,
    },
    // {
    //   name: 'Usher',
    //   icon: AiOutlineUser,
    //   id: 2
    // },
    // {
    //   name: 'Shepherd',
    //   icon: TbCrossFilled,
    //   id: 3
    // }
  ]

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
          <Box maxW={"500px"} w="100%" p={2}>
            <Flex mb={4} gap={4}>
              {sections.map(item => {
                return <Flex 
                flex={1}
                key={item.id} 
                direction={"column"} 
                cursor={'pointer'}
                align="center" 
                borderWidth={item.id === selected ? 2 :1}
                borderColor={item.id === selected ? "black" :"gray.200"}
                rounded="md" p={5} 
                color="gray.500"
                onClick={() => setSelected(item.id)}
                >
                  <Icon as={item.icon} fontSize={36} mb={4} />
                  <Text>{item.name}</Text>
              </Flex>
              })}
            </Flex>

           <BacentaRep />
            {/* {selected === 2 && <Usher />}
            {selected === 3 && <Shepherd />} */}
          </Box>
        </Flex>

      </main>
    </>
  )
}
