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
import { IBusRound } from "@/interface/bus";
import { handleChange } from "@/utils/form";
import { baseCreate } from "@/frontend/apis/base";

export interface AddStopPointDTO {
    people: number,
    stopPoints: [{
        location: string;
        people: number
    }],
}

export default function EndBusTrip(
    {isOpen, onClose, selectedRecord}: 
    {isOpen: boolean, onClose: () => void; selectedRecord?: IBusRound}
    )  {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<any>({
        people: selectedRecord?.people || 0,
        busOffering: selectedRecord?.busOffering || 0
    })

    useEffect(() => {
        setFields({
            people: selectedRecord?.people,
            busOffering: selectedRecord?.busOffering
        })
    }, [selectedRecord])


    const completeTrip = async () => {
        try {
            setLoading(false)
            const payload: any = {
                busState: "ARRIVED", 
                arrivalTime: new Date(), 
                busOffering: fields.busOffering,
                people: fields.people
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
          <ModalHeader>Complete bus trip?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
                
                {Number(fields.people) !== selectedRecord?.people ?
                    <Box p={2} bg="orange.100" my={2} rounded={"md"} color={"orange.500"}>
                        <Text>The entered number of people is different from what you recorded earlier <Text as="span" fontWeight={600}>{selectedRecord?.people}</Text>.Be sure its the correct figure </Text>
                    </Box>
                    :
                    <Box p={2} bg="blue.100" my={2} rounded={"md"} color={"blue.500"}>
                        <Text>You recorded <Text as="span" fontWeight={600}>{selectedRecord?.people}</Text>  people bordered the bus </Text>
                    </Box>
                }
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Review the number of people in bus ?</FormLabel>
                     <Input 
                        type={"text"}
                        name="people"
                        placeholder='Enter here ...' 
                        value={fields.people} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'people', fields, setFields)} 
                    />
                </Box>

                <Box p={2} bg="blue.100" my={2} rounded={"md"} color={"blue.500"}>
                    <Text>Your bus cost is <Text as="span" fontWeight={600}>Ghc {selectedRecord?.busCost}</Text>. Encourage them to give and bless them</Text>
                </Box>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>How much did you receive as bus offering ?</FormLabel>
                    <Input 
                        type={"text"}
                        name="busOffering"
                        placeholder='Enter here ...' 
                        value={fields.busOffering} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'busOffering', fields, setFields)} 
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
                    isDisabled={loading || !fields.busOffering}
                    onClick={(v) => completeTrip()} 
                    >Complete trip
                </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}