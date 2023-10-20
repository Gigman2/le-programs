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
import moment from "moment";
import { TbBallpen, TbTrash } from "react-icons/tb";

export default function ZoneCard({loading, data, name, onOpen, setSelectedBus}:
   {loading?: boolean, data: IBusRound[], name: string, onOpen:() =>  void; setSelectedBus: (a: IBusRound) => void}) {
  const [selected, setSelected] = useState<boolean>(false)

  return (
     <Box
        key={name}
        borderWidth={1}
        borderColor={"gray.200"}
        rounded="md"
        mb={3}
        bg="gray.400"
        overflow={"hidden"}
       
    >
        <Flex align="center" justify={"space-between"} p={2} onClick={() => setSelected(!selected)}>
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
            borderBottomWidth={1} borderBottomColor="gray.300" 
            pb={3} pos="relative"
        >
            <Flex justify={"space-between"} zIndex={2} mb={4}>
                <Flex gap={2}>
                    <Text fontSize={14} color={"gray.500"}>By</Text>
                    <Text fontSize={14} color={"gray.500"} fontWeight={600}>{`${(l.recordedBy as unknown as {name: string})?.name}`} </Text>
                </Flex>
                {l.busState === 'EN_ROUTE' ?<Flex fontSize={14} gap={1}>
                    <Text fontSize={14} color={"gray.500"}>Last point</Text>
                    <Text fontSize={14} color={"gray.500"} fontWeight={600}>
                        {((l.stopPoints as any[])?.[(l.stopPoints as any[]).length - 1]).location as string}
                    </Text>
                </Flex>
                : <Box px={3} py={0} bg="blue.400" color={"white"} rounded={"md"} fontSize={14}>Arrived</Box>}
            </Flex>
            <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
            <Flex flex={1} justify={"space-between"}>
                <Text  fontSize={14} color={"gray.500"}>Duration</Text>
                <Flex gap={2} fontWeight={600} color={"gray.500"}>
                    <Text>{moment(l.created_on).format('h: mm a')}</Text>
                    <Text>-</Text>
                    <Text>{moment(l.arrivalTime).format('h: mm a')}</Text>
                </Flex>
            </Flex>
            <Flex flex={1} justify={"space-between"}>
                <Text fontSize={14} color={"gray.500"}></Text>
                <Text fontSize={15} color={"gray.500"}><Text fontWeight={600} as="span">{l.people}</Text> people </Text>
            </Flex>
            </Flex>
            <Flex fontWeight={500} fontSize={13} justify={"space-between"} gap={6} mt={2}>
            <Flex flex={1} justify={"space-between"}> 
                <Text fontSize={14} color={"gray.500"}>Financial</Text>
                <Text fontWeight={600} color={"gray.500"}>Ghc {`${l.busOffering} ${l.busCost ? '/ '+l.busCost: ''}`}</Text>
            </Flex>
            <Flex flex={1} justify={"flex-end"} gap={2}>
                <Flex p={2} rounded={"md"} align="center" justify="center" cursor="pointer" bg="gray.400" color="white">
                    <Icon fontSize={14} as={TbBallpen} />
                </Flex>
                 <Flex p={2} rounded={"md"} align="center" justify="center" cursor="pointer" bg="red.400" color="white"
                    onClick={() => {
                        setSelectedBus(l)
                        onOpen()
                    }}
                    >
                    <Icon fontSize={14} as={TbTrash} />
                </Flex>
            </Flex>
            </Flex>
        </Box>)}
        </Box>}
    </Box>
  );
}