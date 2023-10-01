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
import { addUser, assignUserToGroup, updateGroup, useBusGroups } from "@/frontend/apis";
import { IBusAccount } from "@/interface/bus";
import Autocomplete from "../Forms/Autocomplete";

export default function AddBusAccount(
    {isOpen, onClose, type, role, parentId, selected}: 
    {isOpen: boolean, onClose: () => void; type: string, role: string, parentId: string, selected?: IBusAccount}
    )  {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<any>({
        name: "",
        email: "",
        assignedGroup: ""
    })

    const {isLoading: groupLoading, data: groupData} = useBusGroups(
    {
        type:  type,
        parent: parentId
    }, 
    {
        type:  type,
        parent: parentId,
        isOpen
    },
    !!(type && parentId)
  )

    useEffect(() => {
        if(selected !== null || selected !== undefined){
            setFields({
                name: selected?.name,
                email: selected?.email,
            })

            const hasAssigned = selected?.accountType?.filter(item => item.groupType === role)
            if(hasAssigned?.length){
                let group = hasAssigned?.[0].groupId
                const newAssigned = groupData?.data.filter(item => item._id === group)
                setFields((prev: any) => ({...prev, group: newAssigned}))
            }
        }
    }, [selected])


    const addBusGroup = async () => {
        try {
            setLoading(true)
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
                console.log(res)
                const assignData = {
                    userId: res?.data?.data?.data?._id as string,
                    groupId: fields.assignedGroup.value
                }
                await assignUserToGroup(assignData)


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
                setLoading(false)
                onClose()
            }
        } catch (error) {
            setLoading(false)
        }
    }


    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {role.replace("_", " ").toLowerCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the name of the {role.replace("_", " ").toLowerCase()} here</FormLabel>
                     <Input 
                        type={"text"}
                        name="name"
                        placeholder='Enter here ...' 
                        value={fields.name} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'name', fields, setFields)} 
                    />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Enter the email of the {role.replace("_", " ").toLowerCase()} here</FormLabel>
                     <Input 
                        type={"text"}
                        name="email"
                        placeholder='Enter here ...' 
                        value={fields.email} 
                        onChange={(v) => handleChange(v?.currentTarget?.value, 'email', fields, setFields)} 
                    />
                </Box>

                <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={3}>
                    <FormLabel fontSize={14}>Select a {type.toLowerCase()} to assign user </FormLabel>
                    <Autocomplete
                        placeholder="Select location" 
                        name={'assignedGroup'}
                        options={groupData?.data.map(item => ({label: item.name, value: item._id})) || []} 
                        value={fields.assignedGroup || fields.group?.map((item: any) =>  ({label: item.name, value: item._id}))?.[0]} 
                        fields={fields} 
                        setFields={setFields}
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
                    >Save {role.replace("_", " ").toLowerCase()}
                </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}