/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Table, Text, Thead, Tbody, Tr, Th, Td, useDisclosure, Skeleton } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbPlus, TbBallpen } from 'react-icons/tb'
import { useBusAccount } from '@/frontend/apis'
import { IBusAccount } from '@/interface/bus'
import AddBusAccount from '@/frontend/components/Modals/addBusAccount'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'



export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const [selected, setSelected] = useState<IBusAccount>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {isLoading, data: accountData} = useBusAccount(
    {
      addedGroup:  currentUser?.currentRole?.groupId as string
    }, 
    {
        addedGroup:  currentUser?.currentRole?.groupId as string,
        isOpen
    },
    !!(currentUser?.currentRole?.groupType === "BUS_HEAD")
  )

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
  },[])

  return (
    <GuardWrapper allowed={['SECTOR_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
        <Box mt={4}>
              <Flex justifyContent={"space-between"}>
                  <Text fontSize={24} fontWeight={600} color={"gray.600"}>Bus Head Accounts</Text>
                  {isLoading ? <Skeleton h={10} rounded={"md"} w={"120px"} /> : <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                    <Icon as={TbPlus} fontSize={20} />
                    Add Bus Head
                  </Flex>}
              </Flex>

              <AddBusAccount
                isOpen={isOpen} 
                onClose={onClose} 
                type='BRANCH' 
                role='SECTOR_HEAD'
                parentId={currentUser?.currentRole?.groupId as string}
                selected={selected as IBusAccount}
              />

              <Box mt={4}>
                  <Table variant="simple">
                      <Thead bg="gray.50">
                          <Tr>
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Name</Th>
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Email</Th>
                              <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Group</Th>
                              <Th textTransform={"capitalize"} color={"gray.500"}>
                                  {/* <Icon as={TbDots}  fontSize={24} /> */}
                              </Th>
                          </Tr>
                      </Thead>
                      <Tbody>
                      {accountData?.data?.map((item) => (
                          <Tr key={item?._id as string}>
                              <Td textTransform={"capitalize"}>
                                  { item.name}
                              </Td>
                                <Td>
                                  { item.email }
                              </Td>
                                <Td>
                                
                              </Td>
                              <Td>
                                <Flex gap={2} py={1} px={2} bg="gray.100" rounded={"md"} align={"center"} cursor={"pointer"} 
                                onClick={() => {
                                  setSelected(item)
                                  onOpen()
                                }}>
                                  <Icon as={TbBallpen} fontSize={20} color={"gray.600"}/>
                                  <Text>Edit</Text>
                                </Flex>
                              </Td>
                          </Tr>
                      ))}
                      </Tbody>
                  </Table>
                    {accountData?.data.length == 0 && (
                      <Flex
                          w="100%"
                          mt={4}
                          justify={"center"}
                          align={"center"}
                      >
                        <Box>
                          <Text>You don&apos;t have a bus head yet</Text>
                          <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                            <Icon as={TbPlus} fontSize={20} /> Add Bus Head
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
