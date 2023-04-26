/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import Image from 'next/image'
import { Box, Flex, Text, Icon, FormLabel } from '@chakra-ui/react'
import CustomInput from '../Forms/CustomInput'
import CustomRadio from '../Forms/CustomRadio'
import { BsImage } from 'react-icons/bs'
import CustomUploader from '../Forms/CustomeUploader'



export default function OtherInfo(
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
            <Text fontWeight={600} fontSize={20} color="gray.600" mb={2}>Other Personal Info</Text>
            <Box>
                <Flex justify={"center"}>
                    <CustomUploader  
                        fields={fields} 
                        setFields={setFields} 
                        errors={errors}  
                        name="avatar"
                        label='Upload you picture'
                        accepts={'image/png, image/jpg, image/jpeg'}
                    />
                </Flex>
                <CustomRadio 
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="maritalStatus" 
                    label="Marital Status" 
                    options={[{name: 'Married',value:'married'}, { name: 'Single', value: 'single'}]}
                />

                <CustomInput
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="dob" 
                    label="Date Of Birth" 
                    type="date"
                />

                <CustomInput
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="residence" 
                    label="Place of Residence" 
                    type="text"
                />
            </Box>
        </Box>
    )
}
