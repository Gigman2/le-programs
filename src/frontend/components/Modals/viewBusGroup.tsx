/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Text,
} from "@chakra-ui/react";
import { IBusGroups } from "@/interface/bus";
import dayjs from "dayjs";
import { useSingleBusGroup } from "@/frontend/apis/bus";

export default function ViewBusGroup(
        {isOpen, onClose, type, subgroup, selected}: 
        {isOpen: boolean, onClose: () => void; type: string; subgroup?: string; selected?: IBusGroups}
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
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>{type === 'zone' ? "Bus rep(s)" : `${type} head(s)`}</Text>
                        {data?.data.accounts?.length ?<Flex gap={2} wrap={"wrap"}>
                            {data?.data?.accounts?.map?.((item: any) => (
                                <Box rounded={"sm"} fontSize={13} bg="gray.100" color={"gray.600"} key={item._id} px={3} py={1}>{item.name}</Box>
                            ))}
                        </Flex> : <Text>No account found for {type} head(s)</Text>}
                    </Box>

                    {subgroup && <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>{subgroup}</Text>
                        {data?.data.subGroup?.length ?
                            <Flex wrap={"wrap"} gap={2}>{data?.data?.subGroup?.map?.((item: any) => (
                            <Box rounded={"sm"} fontSize={13} bg="gray.100" color={"gray.600"} key={item._id} px={3} py={1}>{item.name}</Box>
                            ))}
                        </Flex>
                        : <Text>No zone found in {data?.data.name} {type}</Text>}
                    </Box>}

                    {type =='zone' ? <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"} textTransform={"capitalize"}>Pickup Points</Text>
                        {data?.data.station?.length ?
                            <Flex wrap={"wrap"} gap={2}>{data?.data?.station?.map?.((item: any) => (
                            <Box rounded={"sm"} fontSize={13} bg="gray.100" color={"gray.600"} key={item} px={3} py={1}>{item}</Box>
                            ))}
                        </Flex>
                        : <Text>No zone found in {data?.data.name} {type}</Text>}
                    </Box>:  null}

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