/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import { IBusRound } from "@/interface/bus";

export default function RecordCheckPoint(
    {isOpen, onClose}: 
    {isOpen: boolean, onClose: () => void;}
    )  {
    const cancelRef = React.useRef(null)
    const [loading, setLoading] = useState(false)

    const deleteBusRound = async () => {
        try {
        setLoading(true)
        // await removeBusRoundApi(bus);
        // await getBus()
        onClose()
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }


    return (
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem similique non cumque qui! Repudiandae odio quod harum corporis placeat, ipsum hic provident molestias aut sequi, aspernatur ipsa sint autem ut?
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}