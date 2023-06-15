/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box, Text } from '@chakra-ui/react'
import CustomInput from '../Forms/CustomInput'
import CustomRadio from '../Forms/CustomRadio'

export default function Professional(
    { 
        fields, 
        setFields, 
        errors, 
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>,
    }) {
    


    return (
       <Box mt={4}>
            <Text fontWeight={600} fontSize={20} color="gray.600" mb={2}>Occupational Info</Text>
            <Box>
                <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="profession" 
                    label="Profession" 
                    placeholder='Enter here ..' 
                />
                <CustomRadio
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="student" 
                    label="Are you a student?" 
                    options={[{name: 'Yes',value:true}, { name: 'No', value: false}]}
                />
                {fields['student'] && <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="schoolName" 
                    label="Name of your school" 
                    placeholder='Enter here ..' 
                />}
                <CustomRadio
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="employmentStatus" 
                    label="Employment Status" 
                    options={[{name: 'Employed',value: 'employed'}, { name: 'Unemployed', value: 'unemployed'}]}
                />
                {fields['employmentStatus'] === 'employed' && <CustomInput 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="companyName" 
                    label="Name of the company you work with" 
                    placeholder='Enter here ..' 
                />}
                {fields['employmentStatus'] === 'employed' &&            
                    <CustomInput 
                        fields={fields} 
                        setFields={setFields} 
                        errors={errors} 
                        name="companyLocation" 
                        label="What is the location of your office" 
                        placeholder='Enter here ..' 
                    />}
            </Box>
        </Box>
    )
}
