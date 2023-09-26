/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import { handleChange } from '@/utils/form'


export default function CustomInput(
    { 
        fields, 
        setFields, 
        errors, 
        type,
        name,
        label,
        placeholder
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
        type?: string,
        name: string,
        label: string,
        placeholder?: string
    }) {


    return (
       <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2}  mb={4}>
            <FormLabel fontSize={14} mb={1}>{label}</FormLabel>
            {errors[name] && <Text fontSize={12} color="red.400" mt={1} mb={1}>{errors[name] }</Text>}
            <Input 
                type={type}
                fontSize={14}
                name={name}
                placeholder={placeholder}  
                value={fields[name] as string} 
                onChange={(v) => handleChange(v?.currentTarget?.value, name, fields, setFields)} 
            />
        </Box>
    )
}
