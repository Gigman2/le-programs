/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { Dispatch, SetStateAction } from 'react'
import {  Box, Flex, List } from '@chakra-ui/react'
import { Listbox } from '@headlessui/react'
import { handleChange } from '@/utils/form';

interface IProps {
        value: string | Record<string, string>;
        placeholder: string; 
        options: Record<string, string >[] | any[],
        name: string
        fields: Record<string, string | boolean | undefined>, 
        setFields: Dispatch<SetStateAction<Record<string, string  | boolean | undefined>>>
    }


export default function Autocomplete(
    {value, placeholder, options, name, fields, setFields}: IProps
    ) {

    return (
    <Flex style={{ position: 'relative' }}>
        <Listbox as={Box} w={"100%"} value={value} onChange={(e) => handleChange(e, name, fields, setFields)}>
          <Listbox.Button
            as={Box}
            borderWidth={1}
            borderColor={"gray.200"}
            w="100%"
            py={2}
            px={3}
            rounded="md"
            cursor={"pointer"}
          >
            {value ? (value as {label: string}).label : placeholder}
          </Listbox.Button>
          <Listbox.Options
             as={List}
             w="100%"
             listStyleType={"none"}
             overflow='auto'
             maxHeight='200px'
             position='absolute'
             zIndex={10}
             outline={"none"}
             bg="white"
             borderWidth={1}
             borderColor="gray.100"
             rounded={"sm"}
             top={12}
          >
            {options.map(item => (
              <Listbox.Option
                key={item?.value || item}
                value={item}
                style={{
                  cursor: 'pointer'
                }}
              >
                {({ selected, active }) => (
                  <Box
                    px={2}
                    py={2}
                    my={1}
                    fontWeight={selected ? 600 : 500}
                    bg={active ? 'rgba(29, 49, 179, 0.2)' : ''}
                  >
                    {item.label || item}
                  </Box>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </Flex>
    )
}
