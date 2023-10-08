/* eslint-disable react-hooks/exhaustive-deps */
import { IBusRound } from "@/interface/bus";
import { useState } from 'react'
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import moment from "moment";

export default function ZoneCard({loading, data, name, onOpen, setSelectedBus}:
   {loading?: boolean, data: IBusRound[], name: string, onOpen:() =>  void; setSelectedBus: (a: IBusRound) => void}) {
  const [selected, setSelected] = useState<boolean>(false)

  return (
     <Box
        key={name}
        borderWidth={1}
        borderColor={"gray.200"}
        rounded="md"
        mb={4}
        bg="gray.400"
        overflow={"hidden"}
        onClick={() => setSelected(!selected)}
    >
        <Flex align="center" justify={"space-between"} p={2}>
        <Text fontSize={15} fontWeight={700} color="white">
            {name}
        </Text>
        <Box
            fontWeight={600}
            p={1}
            fontSize={14}
            rounded={"md"}
            color="white"
        >
            {data.length || 0} Buses
        </Box>
        </Flex>
        
        {selected && <Box>
        {data
        .map((l: IBusRound, i: number) =>                   
        <Box key={l._id } bg="gray.200" p={2} 
            borderBottomWidth={1} borderBottomColor="gray.400" 
            pb={3} pos="relative"
        >
            <Flex justify={"space-between"} zIndex={2}>
            <Text fontWeight={600} fontSize={13} textTransform="capitalize"> {l.busState === 'ARRIVED' ? 'Arrived' : 'On Route'}</Text>
            <Flex gap={4} align={"center"}>
                <Flex>
                  <Icon as={BsPencilSquare} />
                </Flex>
                <Flex cursor={"pointer"} onClick={() => {
                 setSelectedBus(l)
                  onOpen()
                }}>
                <Icon as={MdDeleteOutline} fontSize={20} color="red.500" />
                </Flex>
            </Flex>
            </Flex>
            <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
            <Flex flex={1} justify={"space-between"}>
                <Text fontWeight={600}>Start Time</Text>
                <Text>{moment(l.created_on).format('h: mm a')}</Text>
            </Flex>
            <Flex flex={1} justify={"space-between"}>
                <Text fontWeight={600}>End Time</Text>
                <Text>{moment(l.arrivalTime).format('h: mm a')}</Text>
            </Flex>
            </Flex>
            <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
            <Flex flex={1} justify={"space-between"}>
                <Text fontWeight={600}>People</Text>
                <Text>{l.people}</Text>
            </Flex>
            <Flex flex={1} justify={"space-between"}>
                <Text fontWeight={600}>Offering</Text>
                <Text>Ghc {`${l.busOffering} ${l.busCost ? '/ '+l.busCost: ''}`}</Text>
            </Flex>
            </Flex>
        </Box>)}
        </Box>}
    </Box>
  );
}