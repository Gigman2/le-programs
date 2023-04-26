import { Box, Flex, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <Flex 
      align="center" 
      h={16} 
      w="100%" 
      px={6} 
      justify="space-between" 
      borderBottomWidth={1} 
      borderColor="gray.200"
    >
      <Link href="/">
        <Flex align={"center"} w={32} h={16}>
          <Image src="/logo.png" alt="LEC Logo" w={24}/>
        </Flex>
      </Link>
    </Flex>
  )
}
