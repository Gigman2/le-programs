/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text
} from "@chakra-ui/react";
import { IBusRound } from "@/interface/bus";
import {removeBusRoundApi} from "@/frontend/apis";

export default function DeleteBusRound(
    {isOpen, onClose, bus, getBus}: 
    {isOpen: boolean, onClose: () => void; bus: IBusRound; getBus: () => void}
    )  {
    const cancelRef = React.useRef(null)
    const [loading, setLoading] = useState(false)

    const deleteBusRound = async () => {
        try {
        setLoading(true)
        await removeBusRoundApi(bus);
        await getBus()
        onClose()
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }


    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Bus
                </AlertDialogHeader>

                <AlertDialogBody>
                    <Text>Bus was created by <Text as="span" textTransform={"capitalize"} fontWeight={600}>{bus?.busRep}</Text></Text>
                    <Text>Are you sure? You can&lsquo;t undo this action afterwards.</Text>
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='red' onClick={() => {
                   deleteBusRound()
                }} ml={3} 
                isLoading={loading}>
                    Delete
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}