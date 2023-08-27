/* eslint-disable react-hooks/exhaustive-deps */
import {useState} from 'react'
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { TbChevronDown } from 'react-icons/tb';
import { useRouter } from 'next/router';
import moment from 'moment';

export default function MonthyCard({data, title}: {title: string, data: Record<string, any>}) {
    const [collapse, setCollapse] = useState<boolean>(false)
    const router = useRouter();


    return (
        <Box>
            <Flex 
                align={"center"} 
                cursor={"pointer"}
                justifyContent={"space-between"} 
                onClick={() => setCollapse(!collapse)}>
                <Text fontWeight={600} color={"gray.600"}>{title}</Text>
                <Box mr={2}>
                    <Icon as={TbChevronDown} fontSize={20}/>
                </Box>
            </Flex>
            {Object.keys(data).map(c => 
                <Box 
                    key={title+'-'+c} rounded={'md'} 
                    bg="gray.100" p={4} mb={3} 
                    display={!collapse ? 'none' : 'block'} cursor={"pointer"}
                    onClick={() => router.push('statistics/'+data[c].date)}
                >
                    <Text fontWeight={700}>{data[c].date}</Text>
                    <Flex justifyContent={'space-between'} fontSize={15} color={"gray.500"} mb={1} fontWeight={600}>
                        <Text>{c}</Text>
                        <Text>{data[c].eventName}</Text>
                    </Flex>
                    <hr />
                    <Flex  mt={1} justifyContent={'space-between'} color={"gray.500"}>
                    <Flex gap={2}>
                        <Text fontSize={15}>Total Buses</Text>
                        <Text fontWeight={700} color={"gray.500"}>{data[c].totalBuses}</Text>
                    </Flex>

                    <Flex gap={2}>
                        <Text fontSize={15}>People Bused</Text>
                        <Text fontWeight={700} color={"gray.500"}>{data[c].peopleBused}</Text>
                    </Flex>
                    </Flex>
                    <Flex  mt={1} justifyContent={'space-between'} color={"gray.500"}>
                    <Flex gap={2}>
                        <Text fontSize={15}>Total offering received</Text>
                        <Text fontWeight={700} color={"gray.500"}>Ghc {data[c].offering}</Text>
                    </Flex>

                    <Flex gap={2}>
                        <Text fontSize={15}>Actual Busing Cost</Text>
                        <Text fontWeight={700} color={"gray.500"}>Ghc {data[c].cost}</Text>
                    </Flex>
                    </Flex>
                </Box>)
            }
        </Box>
    );
}