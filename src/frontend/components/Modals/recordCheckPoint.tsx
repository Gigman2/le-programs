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
import { IBusGroups, IBusRound } from "@/interface/bus";
import { handleChange } from "@/utils/form";
import Autocomplete from "../Forms/Autocomplete";
import { AddStopPointDTO } from "./endBusTrip";
import { baseCreate, useBaseGetQuery } from "@/frontend/apis/base";

export default function RecordCheckPoint(
    {isOpen, onClose, selectedRecord}: 
    {isOpen: boolean, onClose: () => void; selectedRecord?: IBusRound}
    )  {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<any>({
        people: 0,
        location: ""
    })
    console.log(`bus-groups/${(selectedRecord?.busZone as unknown as {_id: string})?._id}`)
    
    const {isLoading, data: recordData} = useBaseGetQuery<IBusGroups>(
        `bus-groups/${(selectedRecord?.busZone as unknown as {_id: string})?._id}`,
        null,
        {group: (selectedRecord?.busZone as unknown as {_id: string})?._id},
        !!(selectedRecord?.busZone as unknown as {_id: string})?._id
    )
    const record = recordData?.data

    const createRecord = async () => {
        try {
            setLoading(true)
            const data = {...fields}
            const newStopPoints = [...(selectedRecord?.stopPoints || []), data]
            const payload: any = {
                stopPoints : newStopPoints,
                people: (Number(selectedRecord?.people) || 0) + Number(data.people)
            }


            const res = await baseCreate
                <
                    any, 
                    AddStopPointDTO
                >(`bus-rounds/${selectedRecord?._id as string}`,payload)

            if(res){
                toast({
                    status: "success",
                    duration: 2000,
                    position: 'top-right',
                    isClosable: true, 
                    title: "Stop point recorded"
                })
                setFields({
                    people: 0,
                    location: ""
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
          <ModalHeader>Record Check Point</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
                
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>What is your current location?</FormLabel>
                    <Autocomplete
                        placeholder="Select location" 
                        name={'location'}
                        options={record?.station || []} 
                        value={fields.location} 
                        fields={fields} 
                        setFields={setFields}
                    />
                </Box>

                <Box p={2} bg="blue.100" my={2} rounded={"md"} color={"blue.500"}>
                    <Text>You currently have <Text as="span" fontWeight={600}>{selectedRecord?.people}</Text> people </Text>
                </Box>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>How many people joined the bus</FormLabel>
                    <Input 
                        type={"text"}
                        name="people"
                        placeholder='Enter here ...' 
                        value={fields.people} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'people', fields, setFields)} 
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
                    isDisabled={loading || !fields.location}
                    onClick={(v) => createRecord()} 
                    >Record
                </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}