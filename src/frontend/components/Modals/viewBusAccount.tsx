/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Text,
} from "@chakra-ui/react";
import { IBusAccount } from "@/interface/bus";
import { useSingleBusAccount } from "@/frontend/apis/bus";
import dayjs from "dayjs";

export default function ViewBusAccount(
        {isOpen, onClose, type, selected}: 
        {isOpen: boolean, onClose: () => void; type: string, selected?: IBusAccount}
    )  
    {
    const {isLoading, data} = useSingleBusAccount(selected?._id as string, !!(selected?._id))
    
    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Account </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? 
                <Box>
                    <Skeleton h={12} w="100%" mb={2} />
                    <Skeleton h={12} w="100%" mb={2} />
                    <Skeleton h={12} w="100%" mb={2} />
                </Box> :
                <Box>
                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"}>Name</Text>
                        <Text>{data?.data?.name || selected?.name} </Text>
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"}>Email</Text>
                        <Text>{data?.data?.account?.email || selected?.account?.email} </Text>
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"}>Added On</Text>
                        <Text>{dayjs(data?.data?.created_on || selected?.created_on).format('D MMM YYYY, hh:mm a')} </Text>
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"}>Roles</Text>
                        <Flex gap={2}>
                            <Text fontWeight={500} color={"blue.500"}>Sector Head</Text>
                            <Text>for</Text>
                            <Text fontWeight={500} color={"blue.500"}>Accra north sector</Text>
                        </Flex>
                    </Box>

                </Box>}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}