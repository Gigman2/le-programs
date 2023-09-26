/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch, ChangeEvent } from 'react'
import { Box, Flex, Icon,Image,Text } from '@chakra-ui/react'
import { BsImage } from 'react-icons/bs'
import {FiX} from 'react-icons/fi'
import { handleChange } from '@/utils/form'

export default function CustomUploader(
    { 
        fields, 
        setFields, 
        errors, 
        name,
        label,
        accepts
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
        name: string,
        label: string,
        accepts?: string 
    }) {

        const [preview, setPreview] = useState('')

        const handleUploaderPicture = () => {
            const filesEle = document.getElementById(name) as HTMLInputElement
            if(filesEle?.files){
                const file = filesEle?.files?.[0]
                setPreview(URL.createObjectURL(file as File))
                handleChange(file, name, fields, setFields)
            }
        }

        const clearFile = () => {
            setPreview('')
            handleChange({}, name, fields, setFields)
        }

    return (
       <>
            <input type={'file'} id={name} style={{display: "none"}} accept={accepts} onChange={(e) => handleUploaderPicture()}/>
            {preview ? 
                <Box 
                    mb={4}
                    w={'200px'}
                    h={'200px'} 
                    rounded="md" 
                    borderWidth={2} 
                    pos="relative"
                    borderColor="gray.400" 
                    borderStyle={"dashed"} >
                        <Flex cursor={"pointer"} 
                            rounded={"full"} 
                            w={8} h={8} 
                            pos="absolute" 
                            zIndex={3} 
                            bg="red.300"
                            align={"center"} 
                            justify="center"
                            right={-2}
                            top={-2}
                            onClick={() => clearFile()}
                        >
                            <Icon as={FiX} color="white" fontSize={20}/>
                        </Flex>
                        <Box  overflow="hidden"  w="100%" h="100%">
                                <Image src={preview} alt={name} pos="relative" zIndex={2}/>
                        </Box>

                </Box>:
                <label htmlFor={name}>
                    <Flex 
                        cursor={"pointer"}
                        direction={"column"}
                        w={'200px'} 
                        h={'200px'} 
                        mb={4} 
                        rounded="md" 
                        borderWidth={2} 
                        borderColor="gray.400" 
                        borderStyle={"dashed"} 
                        align="center"
                        justify="center"
                    >
                        <Icon as={BsImage} color="gray.300" fontSize={48} />
                        <Text mt={4} fontSize={14} color="gray.400">Tap and select a picture</Text>
                    </Flex>
                </label>    
            }
       </>
    )
}
