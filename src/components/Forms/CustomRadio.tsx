
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import { handleChange } from '@/utils/form'


export default function CustomRadio(
    { 
        options,
        fields, 
        setFields, 
        errors, 
        name,
        label,
    }: {
        options: Record<string, string| boolean>[],
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
        name: string,
        label: string,
    }) {


    return (
        <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2} mb={4}>
            <FormLabel fontSize={14}>{label}</FormLabel>
            {errors[name] && <Text fontSize={12} color="red.400" mt={1} mb={1}>{errors[name] }</Text>}
            <Flex fontSize={14} w="100%">
                {options.map(item => <Flex key={item.label as string}  flex={1}>
                    <Flex 
                        align={"center"} 
                        w={6} h={6} 
                        borderWidth={1} 
                        borderColor={'gray.300'} 
                        rounded="full"
                        mr={1} p={1}
                        onClick={() => handleChange(item.value, name, fields, setFields)} 
                    >
                        <Box 
                            w={4} h={4} 
                            rounded={"full"} 
                            bg={fields[name] === item.value ? "blue.600" : "gray.200"}
                        />
                    </Flex>
                    <Text>{item.name}</Text>
                </Flex>)}
            </Flex>
        </Box>
    )
}