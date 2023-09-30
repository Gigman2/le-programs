/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";
import { handleChange } from "@/utils/form";
import { addUser, updateGroup } from "@/frontend/apis";
import { IBusAccount } from "@/interface/bus";

export default function AddBusAccount(
    {isOpen, onClose, type, parentId, selected}: 
    {isOpen: boolean, onClose: () => void; type: string, parentId: string, selected?: IBusAccount}
    )  {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<any>({
        name: "",
        email: ""
    })

    useEffect(() => {
        if(selected !== null || selected !== undefined){
            setFields({
                name: selected?.name,
                email: selected?.email
            })
        }
    }, [selected])


    const addBusGroup = async () => {
        const payload: any = {
            name: fields.name, 
            email: fields.email, 
            group: parentId,
        }
   
        let res: any
        if(selected){
            res = await updateGroup(selected?._id as string, payload)
        } else {
            res = await addUser(payload)
        }

        if(res){
            toast({
                status: "success",
                duration: 2000,
                position: 'top-right',
                isClosable: true, 
                title: "Bus account saved"
            })
            setFields({
                name: "",
                stations: ""
            })
            onClose()
        }
    }


    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {type.replace("_", " ").toLowerCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the name of the {type.replace("_", " ").toLowerCase()} here</FormLabel>
                     <Input 
                        type={"text"}
                        name="name"
                        placeholder='Enter here ...' 
                        value={fields.name} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'name', fields, setFields)} 
                    />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the email of the {type.replace("_", " ").toLowerCase()} here</FormLabel>
                     <Input 
                        type={"text"}
                        name="email"
                        placeholder='Enter here ...' 
                        value={fields.email} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'email', fields, setFields)} 
                    />
                </Box>


                <Box as={Button} 
                    width="full" 
                    mt={8} 
                    mb={4}
                    bg="base.blue" 
                    color="white" 
                    _hover={{bg: "base.blue"}}
                    _focus={{bg: "base.blue"}}
                    _active={{bg: "base.blue"}}
                    isLoading={loading}
                    isDisabled={loading || (!fields.name && !fields.email)}
                    onClick={(v) => addBusGroup()} 
                    >Save {type.replace("_", " ").toLowerCase()}
                </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}