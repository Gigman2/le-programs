/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Box, Input } from '@chakra-ui/react'
import { handleChange } from '@/utils/form';

export default function Autocomplete(
    {name, placeholder, data, fields, setFields, noMatch, queryValue, search, setSearch, onSelected}: 
    {
        name: string;
        placeholder: string; 
        data: Record<string, string >[],
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>, 
        noMatch?: (b: boolean) => void,
        queryValue?: (v: string) => void,
        search: string,
        setSearch: Dispatch<SetStateAction<string>>
        onSelected?: (v: Record<string, string>) => void,
    }) {
    const [close, setClose] = useState<boolean>(true)
    const [match, setMatch] = useState<boolean>(false)
    const [filteredData, setFilteredData] = useState<Record<string, string>[]>([])


    useEffect(() => {
        const results = [];
        if(queryValue) queryValue(search)
        if(!match){
            if(results.length > 0) setClose(true)

            for (let i = 0; i < data.length; i++) {
                let value = (data[i].value as string).toLowerCase()
                if (value.includes(search.toLowerCase())) {
                    results.push(data[i]);
                }
            }
            setFilteredData(results as Record<string, string>[])
            if(results.length > 0) setClose(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    useEffect(() => {
        if(noMatch) noMatch(Boolean((!filteredData.length && search.length &&  !(fields?.[name] as string)?.length)))
    }, [filteredData, search, fields])

    useEffect(() => {
        setFilteredData([])
    }, [])

    return (
        <Box>
            <Input 
                placeholder={placeholder} 
                value={search } 
                onChange={(v) => {
                    setSearch(v.currentTarget.value)
                    const fieldData = {...fields}
                    fieldData[name] = ''
                    setFields({...fieldData, groupName: ''})
                    setMatch(false)
                }
            } />

            {!close && filteredData.length > 0 &&  <Box mt={4} borderWidth={1} borderColor={"gray.300"} rounded="md" 
                maxH={'300px'}
                overflowY='scroll' >
                {filteredData.map((item, i) => (
                    <Box key={item.label} 
                        p={2} 
                        borderBottomWidth={ i+1 === filteredData.length  ? 0 : 1} 
                        borderColor="gray.300"
                        cursor="pointer"
                        _hover={{bg: 'gray.300'}}
                        onClick={() => {
                            handleChange(item.label, name, fields, setFields)
                            if(onSelected){
                                onSelected(item)
                            }
                            setFilteredData([])
                            setMatch(true)
                            setSearch(item.value)
                        }}
                        >{item.value}
                    </Box>
                ))}
            </Box>}
        </Box>
    )
}
