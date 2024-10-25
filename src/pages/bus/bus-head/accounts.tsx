/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Table, Text, Thead, Tbody, Tr, Th, Td, useDisclosure, Skeleton } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbBallpen, TbEye, TbPlus } from 'react-icons/tb'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper' 
import { IBusAccount } from '@/interface/bus'
import AddBusAccount from '@/frontend/components/Modals/addBusAccount'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import ViewBusAccount from '@/frontend/components/Modals/viewBusAccount'
import { useBasePostQuery } from '@/frontend/apis/base'



export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const [selected, setSelected] = useState<IBusAccount>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenAccount, onOpen: onOpenAccount, onClose: onCloseAccount } = useDisclosure()


  const {isLoading, data: accountData} = useBasePostQuery<IBusAccount[]>(
    'bus-accounts/all',
     {
      "$or": [
        {addedGroup:  currentUser?.currentRole?.groupId as string},
        {
          "$and": [
            {'accountType.groupType':  "BUS_REP"},
            {'accountType.groupId':   currentUser?.currentRole?.groupId }
          ]
        }
      ]
    },
    {
        addedGroup:  currentUser?.currentRole?.groupId as string,
        isOpen
    },
    !!(currentUser?.currentRole?.groupType === "BUS_HEAD")
  )

  const sortedData = accountData?.data?.sort((a, b) => {
    return (a.accountType?.length || 0) - (b.accountType?.length || 0)
  })

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
  },[])

  return (
    <GuardWrapper allowed={['BUS_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Box mt={4}>
              <Flex justifyContent={"space-between"}>
                  <Text fontSize={24} fontWeight={600} color={"gray.600"}>Bus Rep Accounts</Text>

                  {isLoading ? <Skeleton h={10} rounded={"md"} w={"120px"} /> : <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                    <Icon as={TbPlus} fontSize={20} />
                    Add Bus Rep
                  </Flex>}
              </Flex>

              <AddBusAccount
                isOpen={isOpen} 
                onClose={onClose} 
                type='ZONE' 
                role='BUS_REP'
                parentId={currentUser?.currentRole?.groupId as string}
                selected={selected as IBusAccount}
              />

              <ViewBusAccount
                isOpen={isOpenAccount} 
                onClose={onCloseAccount} 
                type='BRANCH' 
                selected={selected as IBusAccount}
              />

              <Box mt={4} maxH={'calc(100vh - 200px)'} overflowY={'scroll'}>
                  <Flex gap={2} my={2}>
                    <Text color="gray.500">Key</Text>
                    <Box  fontSize={14} px={2} rounded={"md"} bg={"blue.100"} color={"blue.500"}>Assigned</Box>
                    <Box fontSize={14} px={2} rounded={"md"} bg={"orange.100"} color={"orange.500"}>Unassigned</Box>
                  </Flex>
                  { isLoading ? 
                    <>
                      <Skeleton mb={2} h={12} w="100%" />
                      <Skeleton mb={2} h={12} w="100%" />
                    </>
                  : 
                  <Table variant="simple">
                      <Thead bg="gray.50" fontSize={14}>
                          <Tr >
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Name</Th>
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Email</Th>
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"} maxW={4}></Th>
                              <Th textTransform={"capitalize"} color={"gray.500"}>
                                  {/* <Icon as={TbDots}  fontSize={24} /> */}
                              </Th>
                          </Tr>
                      </Thead>
                      <Tbody fontSize={14}>
                      {sortedData?.map((item) => (
                          <Tr key={item?._id as string}>
                              <Td textTransform={"capitalize"} p={2}>
                                  { item.name}
                              </Td>
                              <Td p={2}>
                                <Text>{item.account ? item.account?.email.slice(0, 7)+'...' : " -- "}</Text>
                              </Td>
                              <Td p={2}>
                                  <Box 
                                    py={3} 
                                    bg={item.accountType?.length ? "blue.100" : "orange.100" }
                                    textAlign={"center"} 
                                    rounded={"md"}
                                    color={item.accountType?.length ? "blue.500" : "orange.500"}
                                  />
                              </Td>
                              <Td>
                                <Flex gap={2}>
                                  <Box w={8} py={1} px={1} bg="gray.100" rounded={"md"} textAlign={"center"} cursor={"pointer"} 
                                      onClick={() => {
                                        setSelected(item)
                                        onOpenAccount()
                                      }}>
                                        <Icon as={TbEye} fontSize={20} color={"gray.600"}/>
                                    </Box>
                                    <Box w={8} py={1} px={1} bg="gray.100" rounded={"md"} textAlign={"center"} cursor={"pointer"} 
                                      onClick={() => {
                                        setSelected(item)
                                        onOpen()
                                      }}>
                                    <Icon as={TbBallpen} fontSize={20} color={"gray.600"}/>
                                  </Box>
                                </Flex>
                              </Td>
                          </Tr>
                      ))}
                      </Tbody>
                  </Table>
                  }
                  {accountData?.data.length == 0 && (
                        <Flex
                            w="100%"
                            mt={4}
                            justify={"center"}
                            align={"center"}
                        >
                          <Box>
                            <Text>You don&apos;t have a bus rep yet</Text>
                            <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                              <Icon as={TbPlus} fontSize={20} /> Add Bus Rep
                            </Flex>
                          </Box>
                        </Flex>
                    )}
              </Box>
        </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
