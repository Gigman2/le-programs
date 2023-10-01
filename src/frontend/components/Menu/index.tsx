import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { TbX } from 'react-icons/tb'
import {Dispatch, SetStateAction} from 'react'

const MenuItem = ({item, index}: {item: {title: string, icon: any,  fn:  any}, index: number}) => {

    return <Flex align={"center"} color={"gray.600"} borderTopWidth={index > 0 ? 1 : 0} py={3}  cursor="pointer" onClick={(item.fn !== null) ? () => item.fn() : () => null}>
                <Flex rounded={"md"} bg="gray.200" p={3}>
                    <Icon as={item.icon} fontSize={24} />
                </Flex>
                <Text ml={6} fontSize={20}>{item.title}</Text>
            </Flex>
}

export default function Menu({options, show, setShow}: {options: {title: string, icon: any, fn:  any}[], show: boolean, setShow: Dispatch<SetStateAction<boolean>>}) {
  return (
     <>
        {show && <Box position={"absolute"} h="100%" maxW={"500px"} w="100%" bg="blackAlpha.600" zIndex={10}>
        <Box position={"absolute"} h="100%" w={"300px"} bg="white" right={0} p={4} borderWidth={1} borderColor={"gray.400"}>
            <Flex justify={"flex-end"} onClick={() => setShow(false)} cursor={"pointer"}>
                <Icon as={TbX} fontSize={32}/>
            </Flex>

            <Box mt={24}>
                {options?.map((item, i) => <MenuItem key={item.title} item={item} index={i} />)}
            </Box>
        </Box>
    </Box>}
     </>
  )
}
