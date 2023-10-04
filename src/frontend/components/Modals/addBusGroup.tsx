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
    Text,
    useToast
} from "@chakra-ui/react";
import { handleChange } from "@/utils/form";
import { addGroup, updateGroup } from "@/frontend/apis";
import { IBusGroups } from "@/interface/bus";

export default function AddBusGroup(
    {isOpen, onClose, type, parentId, selected}: 
    {isOpen: boolean, onClose: () => void; type: string, parentId: string, selected?: IBusGroups}
    )  {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<any>({
        name: "",
        stations: ""
    })

    useEffect(() => {
        if(selected !== null || selected !== undefined){
            setFields({
                name: selected?.name,
                stations: selected?.station.join(', ')
            })
        }
    }, [selected])


    const addBusGroup = async () => {
        try {
            setLoading(false)
            const payload: any = {
                name: fields.name, 
                parent: parentId || null,
                type: type.toUpperCase()
            }

            if(fields.stations.length){
                payload.station = fields.stations.split(',').map((item : string) => item.trim()) || []
            }
    
            let res: any
            if(selected){
                res = await updateGroup(selected?._id as string, payload)
            } else {
                res = await addGroup(payload)
            }

            if(res){
                toast({
                    status: "success",
                    duration: 2000,
                    position: 'top-right',
                    isClosable: true, 
                    title: "Bus Group Created"
                })
                setFields({
                    name: "",
                    stations: ""
                })
                onClose()
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }


    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selected ? 'Edit' : 'Add'} {type}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the name of the {type}?</FormLabel>
                     <Input 
                        type={"text"}
                        name="name"
                        placeholder='Enter here ...' 
                        value={fields.name} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'name', fields, setFields)} 
                    />
                </Box>

                {(['zone', 'branch'].includes(type)) ? <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the stations / pick up points in the {type}?</FormLabel>
                    <Text color="blue.500" fontSize={14}>Separate them by comma eg. East legon, UPSA, Atomic</Text>
                    <Input 
                        type={"text"}
                        name="stations"
                        placeholder='Enter here ...' 
                        value={fields.stations} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'stations', fields, setFields)} 
                    />
                </Box>: <></>}


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
                    isDisabled={loading || !fields.name}
                    onClick={(v) => addBusGroup()} 
                    >Save {type}
                </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}