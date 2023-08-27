/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";

export default function InfoBox({loading, info, title, unit}: {unit?: string, loading: boolean, title: string, info: Record<string, any>}) {


  return (
    <Box flex={1}  bg="gray.100" rounded={"md"} p={4}>
        <Text fontWeight={600} color="gray.500" fontSize={15} mb={2}>{title}</Text>
        {loading ?<Flex w="100%" h="100%" justify={"center"} align="center">
            <Spinner />
        </Flex> : Object.keys(info || {}).map(item => (
            <Flex align="center" justify={"space-between"} key={item}>
            <Text fontSize={14}>
                {item}
            </Text>
            <Box fontWeight={600} p={1} fontSize={14} rounded={"md"}>
                {unit} {info[item]}
            </Box>
            </Flex>))
        }
    </Box>
  );
}