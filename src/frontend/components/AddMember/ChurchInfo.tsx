/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Text } from '@chakra-ui/react'
import CustomInput from '../Forms/CustomInput'
import CustomRadio from '../Forms/CustomRadio'

export default function Church(
    { 
        fields, 
        setFields, 
        errors
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
    }) {

    



    return (
       <Box mt={4}>
            <Text fontWeight={600} fontSize={20} color="gray.600" mb={2}>Church Info</Text>
            <Box>
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="position" 
                    label="Position" 
                    placeholder='Enter here ..' 
                />
                <CustomRadio
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="partner" 
                    label="Are you a partner?" 
                    options={[{name: 'Yes',value:true}, { name: 'No', value: false}]}
                />
                <CustomRadio
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="tither" 
                    label="Are you a tither?" 
                    options={[{name: 'Yes',value:true}, { name: 'No', value: false}]}
                />
                {fields['tither'] && <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="titheID" 
                    label="Tithe ID" 
                    placeholder='Enter here ..' 
                />}
               <CustomRadio
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="baptized" 
                    label="Are you a baptized?" 
                    options={[{name: 'Yes',value:true}, { name: 'No', value: false}]}
                />
            </Box>
        </Box>
    )
}
