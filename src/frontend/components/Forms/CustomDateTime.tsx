/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import { handleChange } from '@/utils/form'


export default function CustomDateTime(
    { 
        fields, 
        setFields, 
        errors, 
        type,
        name,
        time,
        date,
        label,
        placeholder
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
        type?: string,
        time: string,
        date: string,
        name: string,
        label: string,
        placeholder?: string
    }) {


    return (
       <Box borderWidth={1} borderColor={"gray.200"} rounded="md" p={2}  mb={4}>
            <FormLabel fontSize={14} mb={1}>{label}</FormLabel>
            {errors[name] && <Text fontSize={12} color="red.400" mt={1} mb={1}>{errors[name] }</Text>}
            <Flex gap={3}>
                <Input 
                    w={"60%"}
                    type={'date'}
                    fontSize={14}
                    name={`${name}-${time}`}
                    placeholder={placeholder}  
                    value={fields[time] as string} 
                    onChange={(v) => handleChange(v?.currentTarget?.value, time, fields, setFields)} 
                />
                <Input 
                    w="40%"
                    type={'time'}
                    fontSize={14}
                    name={`${name}-${time}`}
                    placeholder={placeholder}  
                    value={fields[date] as string} 
                    onChange={(v) => handleChange(v?.currentTarget?.value, date, fields, setFields)} 
                />
            </Flex>
        </Box>
    )
}
