/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IBusRound } from "@/interface/bus";
import InfoBox from "./infoBox";
import ZoneCard from "./zoneCard";

export default function BusingAdmin(
    {data, loading, onOpen,setSelectedBus}: 
    {setSelectedBus: (i: IBusRound) => void, data?: any, loading: boolean, onOpen:() => void}
) {

  return (
    <Box>
    <Flex w="100%" justify={"center"}>
        <Box minW={"500px"} w="350px">
        <Flex
            mb={4}
            justify="space-between"
            gap={4}
        >
            <InfoBox loading={loading} info={data?.busInfo} title="Bus Information" />

            <InfoBox loading={loading} info={data?.peopleInfo} title="People Information" />

        </Flex>

        <InfoBox loading={loading} info={data?.financeInfo} title="Finance Summary" unit="Ghc" />


        <Box mt={4}>
        <Flex justify={"space-between"} flexDirection="row">
            <Text fontSize={15} fontWeight={700}>
            Busing groups
            </Text>
            <Text fontWeight={700}>{Object.keys(data?.zones || {}).length}</Text>
        </Flex>
            {loading && <Skeleton w="100%" h={24} rounded="md" colorScheme="blue"/>}
            
            {!loading && Object.keys(data?.zones||{})?.map((item : string) => (
                <ZoneCard 
                    key={item} 
                    loading={loading} 
                    data={data?.zones[item]}  
                    name={item} 
                    setSelectedBus={setSelectedBus}
                    onOpen={onOpen}
                />
            ))}
        </Box>
        </Box>
    </Flex>
    </Box>
  );
}