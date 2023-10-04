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
import { IBusAccount, IBusGroups } from "@/interface/bus";
import dayjs from "dayjs";
import { useSingleBusGroup } from "@/frontend/apis/bus";

export default function ViewBusGroup(
        {isOpen, onClose, type, selected}: 
        {isOpen: boolean, onClose: () => void; type: string, selected?: IBusGroups}
    )  
    {
      const {isLoading, data} = useSingleBusGroup(selected?._id as string, !!(selected?._id)
  )
    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View  {type}</ModalHeader>
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
                        <Text>{selected?.name} </Text>
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>{type} head(s)</Text>
                        <Flex>
                            {data?.data?.accounts?.map?.((item: any) => (
                                <Box rounded={"sm"} fontSize={13} bg="gray.100" color={"gray.600"} key={item._id} px={3} py={1}>{item.name}</Box>
                            ))}
                        </Flex>
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>Branches</Text>
                        <Flex wrap={"wrap"} gap={2}>{data?.data?.subGroup?.map?.((item: any) => (
                            <Box rounded={"sm"} fontSize={13} bg="gray.100" color={"gray.600"} key={item._id} px={3} py={1}>{item.name}</Box>
                        ))}</Flex>
                    </Box>

                     <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>Created on</Text>
                        <Text>{dayjs(selected?.created_on as Date).format('D MMM YYYY, hh:mm a')} </Text>
                    </Box>
                </Box>}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}