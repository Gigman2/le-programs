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
    useToast,
} from "@chakra-ui/react";
import { IBusAccount } from "../../../interface/bus";
import dayjs from "dayjs";
import { baseCreate, useBaseGetQuery } from "../../apis/base";

export default function ViewBusAccount(
        {isOpen, onClose, type, selected}: 
        {isOpen: boolean, onClose: () => void; type: string, selected?: IBusAccount}
    )  
    {
    const [sending, setSending] = useState(false)
    const toast = useToast()
    const {isLoading, data} = useBaseGetQuery<IBusAccount>(`bus-accounts/${selected?._id as string}`, null, {account: selected?._id as string}, !!(selected?._id))

    const resendPassword = async (email: string) => {
        try {
            setSending(true)
            const res = await baseCreate(`bus-accounts/resend-password`, {email})
            if(res) toast({
                status: "success",
                title: "Password Sent"
            })
        } catch (error) {
            toast({
                status: "error",
                title: "Error Sending Password"
            })
        } finally {
            setSending(false)
        }
    }
    
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
                        {data?.data.accountType?.map(item => 
                            (<Flex gap={2} key={item.groupId}>
                                <Text fontWeight={500} color={"blue.500"} textTransform={"capitalize"}>{item.groupType.replace("_", ' ').toLowerCase()}</Text>
                                {item.group ? <>
                                    <Text>for</Text>
                                    <Text fontWeight={500} color={"blue.500"}>{item.group.name}</Text>
                                </>: null}
                            </Flex>))}
                    </Box>

                    <Box mb={4}>
                        <Text fontWeight={600} fontSize={14} color={"gray.600"}>Resend Account Password</Text>
                        <Button colorScheme="blue" isLoading={sending} onClick={sending ? () => {} : () => resendPassword(data?.data?.account?.email as string)}>Resend</Button>
                    </Box>

                </Box>}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}