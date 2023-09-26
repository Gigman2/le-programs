/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Box, Flex, FormLabel, Icon, Input, Text } from '@chakra-ui/react'
import { handleChange } from '@/utils/form';
import {RxCaretDown} from 'react-icons/rx'

export default function Autocomplete(
    {name, label, data, fields, setFields}: 
    {
        name: string;
        placeholder: string; 
        data: string[],
        label: string,
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
    }) {
    const [isOpen, setOpen] = useState<boolean>(false)

    useEffect(() => {
    }, [])

    return (
        <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2}>
            <FormLabel fontSize={14} mb={1}>{label}</FormLabel>
            <Flex 
                justify="space-between" 
                cursor={"pointer"} borderWidth={1} 
                borderColor="gray.200" p={2} 
                fontSize={14} rounded={'md'}
                onClick={() => setOpen(!isOpen)}
            >
                {fields[name] ? <Text>{fields[name]}</Text> : <Text color="gray.500">Select a meeting type...</Text> }
                <Icon as={RxCaretDown} fontSize={24} />
            </Flex>
            {isOpen && data.length > 0 &&  <Box mt={4} borderWidth={1} borderColor={"gray.300"} rounded="sm" 
                maxH={'200px'}
                overflowY='scroll' >
                {data.map((item, i) => (
                    <Box key={item} 
                        p={2} 
                        fontSize={14}
                        borderBottomWidth={1} 
                        borderColor="gray.300"
                        cursor="pointer"
                        _hover={{bg: 'gray.100'}}
                        onClick={() => {
                            handleChange(item, name, fields, setFields)
                            setOpen(false)
                        }}
                        >{item}
                    </Box>
                ))}
            </Box>}
        </Box>
    )
}
