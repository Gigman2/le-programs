/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Table, Text, Thead, Tbody, Tr, Th, Td, useDisclosure, Skeleton } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbAlignRight, TbHistory, TbPower, TbPlus, TbLayoutBottombarCollapseFilled, TbUsersGroup, TbBallpen, TbEye, TbDots } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useBusGroupTree, useBusGroups } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper' 
import AddBusGroup from '@/frontend/components/Modals/addBusGroup'
import { IBusGroups } from '@/interface/bus'
import ViewBusGroup from '@/frontend/components/Modals/viewBusGroup'
import AppWrapper from '@/frontend/components/layouts/appWrapper'



export default function OverallGroups() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const [selectedGroup, setSelectedGroup] = useState<IBusGroups>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenViewGroup, onOpen: onOpenViewGroup, onClose: onCloseViewGroup } = useDisclosure()


  const {isLoading, data: groupData} = useBusGroups(
    {
        type:  "SECTOR",
    }, 
    {
        type:  "SECTOR",
        isOpen
    },
    !!(currentUser?.currentRole?.groupType === "OVERALL_HEAD")
  )

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
  },[])

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
          <Box mt={4}>
            <Flex  justifyContent={"space-between"}>
                <Text fontSize={24} fontWeight={600} color={"gray.600"}>Sector Management</Text>

                {isLoading ? <Skeleton h={10} rounded={"md"} w={"120px"} /> : <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                  <Icon as={TbPlus} fontSize={20} />
                  Add Sector
                </Flex>}
            </Flex>

                <AddBusGroup 
                  isOpen={isOpen} 
                  onClose={onClose} 
                  type='sector' 
                  parentId={currentUser?.currentRole?.groupId as string}
                  selected={selectedGroup}
                />

                <ViewBusGroup
                  isOpen={isOpenViewGroup} 
                  onClose={onCloseViewGroup} 
                  type='sector' 
                  selected={selectedGroup}
                />

                <Box mt={4}>
                    {isLoading ? 
                    <>
                      <Skeleton mb={2} h={12} w="100%" />
                      <Skeleton mb={2} h={12} w="100%" />
                    </>
                    : <Table variant="simple">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Name</Th>
                                <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Heads</Th>
                                <Th textTransform={"capitalize"} color={"gray.500"}>
                                    <Icon as={TbDots}  fontSize={24} />
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {groupData?.data?.map((item) => (
                            <Tr key={item?._id as string}>
                                <Td>
                                    { item.name}
                                </Td>
                                <Td>
                                    {item?.accounts?.length}
                                </Td>
                                <Td>
                                  <Flex gap={3}>
                                    <Flex w={10} py={1} px={2} bg="gray.100" rounded={"md"} align={"center"} cursor={"pointer"} 
                                      onClick={() => {
                                        setSelectedGroup(item)
                                        onOpenViewGroup()
                                      }}>
                                        <Icon as={TbEye} fontSize={20} color={"gray.600"}/>
                                    </Flex>
                                    <Flex w={10} py={1} px={2} bg="gray.100" rounded={"md"} align={"center"} cursor={"pointer"} 
                                      onClick={() => {
                                        setSelectedGroup(item)
                                        onOpen()
                                      }}>
                                        <Icon as={TbBallpen} fontSize={20} color={"gray.600"}/>
                                    </Flex>
                                  </Flex>
                                </Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
                  }
                  {groupData?.data.length == 0 && (
                      <Flex
                          w="100%"
                          mt={4}
                          justify={"center"}
                          align={"center"}
                      >
                        <Box>
                          <Text>You don&apos;t have a zone yet</Text>
                          <Flex align={"center"} py={2} px={3} bg="gray.500" color="white" rounded={"md"} cursor={"pointer"} onClick={() => onOpen()}>
                            <Icon as={TbPlus} fontSize={20} />
                            Add Sector
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
