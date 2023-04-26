/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, SetStateAction, Dispatch } from 'react'
import { Box,  Text } from '@chakra-ui/react'
import CustomInput from '../Forms/CustomInput'
import Autocomplete from '../Forms/Autocomplete'


export default function NextOfKin(
    { 
        fields, 
        setFields, 
        errors
    }: {
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        errors: Record<string, string | undefined>
    }) {
    const [search, setSearch] = useState<string>('')
        
    const relationships = [
        {label: "mother", value: "Mother"}
    ]

    return (
       <Box mt={4}>
            <Text fontWeight={600} fontSize={20} color="gray.600" mb={2}>Next Of Kin</Text>
            <Box>
                <CustomInput 
                    type={'text'}
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="nextOfKin" 
                    label="Next of Kin" 
                    placeholder='John Doe' 
                />

                <Box mb={4}  borderWidth={1} borderColor={"gray.200"} rounded="md" p={2}>
                    <Text fontSize={14} color="gray.700">Relationship to Next of Kin</Text>
                    <Autocomplete 
                        fields={fields}
                        setFields={setFields}
                        data={relationships}
                        name="relationshipNextOfKin" 
                        placeholder='Select relationship to next of kin'
                        search={search}
                        setSearch={setSearch}
                    />
                </Box>

                <CustomInput 
                    type={'text'}
                    fields={fields} 
                    setFields={setFields} 
                    errors={errors} 
                    name="contactNextOfKin" 
                    label="Contact to Next of Kin" 
                    placeholder='024 XXX XXX XXXX' 
                />
            </Box>
        </Box>
    )
}
