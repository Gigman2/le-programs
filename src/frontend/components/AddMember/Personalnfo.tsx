/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Text } from '@chakra-ui/react'
import CustomInput from '../Forms/CustomInput'

export default function PersonalInfo(
    { 
        fields, 
        setFields, 
        errors
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>
    }) {

    return (
       <Box mt={4}>
            <Text fontWeight={600} fontSize={20} color="gray.600" mb={2}>Personal Info</Text>
            <Box>
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="surname" 
                    label="Surname" 
                    placeholder='Name goes here ..' 
                />
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="otherName" 
                    label="Other Names" 
                    placeholder='Enter goes here ..' 
                />
                <CustomInput 
                    type={'email'}
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="email" 
                    label="Email" 
                    placeholder='john@doe.com' 
                />
                <CustomInput 
                    type={'phone'}
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="phoneNumber" 
                    label="Phone Number" 
                    placeholder='233 XXX XXX XXXX' 
                />
                <CustomInput 
                    type={'phone'}
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="otherNumber" 
                    label="Alternate Phone Number / Whatsapp" 
                    placeholder='233 XXX XXX XXXX' 
                />
            </Box>
        </Box>
    )
}
