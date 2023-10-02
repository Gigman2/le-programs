/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Button, Flex, Icon, Table, Text, Thead, Tbody, Tr, Th, Td, MenuButton, MenuList, MenuItem, Menu as DropMenu, useDisclosure, Skeleton } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { BsPersonFillAdd } from 'react-icons/bs'
import { MdAddBusiness } from 'react-icons/md'
import { TbAlignRight, TbDots, TbHistory, TbPower, TbDotsVertical, TbPlus, TbLayoutBottombarCollapseFilled, TbUsersGroup, TbBallpen } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useBusGroupTree, useBusGroups } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper' 
import AddBusGroup from '@/frontend/components/Modals/addBusGroup'
import { IBusGroups } from '@/interface/bus'



export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const [selectedGroup, setSelectedGroup] = useState<IBusGroups>()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const MenuOptions = [
    {title: "Manage Sectors", icon: TbLayoutBottombarCollapseFilled, fn: () => router.push(`/bus/overall-head/groups`)},
    {title: "Manage Sector Heads", icon: TbUsersGroup, fn:  () => router.push(`/bus/overall-head/accounts`)},
    {title: "History", icon: TbHistory, fn:  ()=>{}},
    {title: "Logout", icon: TbPower, fn: removeSession}
  ]

  const {isLoading, data: groupTree} = useBusGroupTree(currentUser?.currentRole?.groupId as string, 
    !!(currentUser?.currentRole?.groupType === "OVERALL_HEAD")
  )

  const {isLoading: groupLoading, data: groupData} = useBusGroups(
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
    if(groupTree?.data.length){
          const busTreeData = groupTree?.data
          const bus = busTreeData.reduce((acc: GroupedUnits, cValue) => {
            if(cValue){
              acc[cValue.type] = {
                  id: cValue._id,
                  name: cValue.name
              }
            }
            return acc
          }, {})
          const account = currentUser as IAccountUser

          saveBusUser({...account, bus})
          setCurrentUser({...account, bus})
    }
  }, [groupTree])

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
  },[])

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
      <PageWrapper>
        <Box maxW={"500px"} w="100%"  h={"100vh"} position={"relative"}>
          <Menu options={MenuOptions} show={showMenu} setShow={setShowMenu} />
          <Flex align={"center"} justify="space-between" bg="gray.100" py={4} px={2} mt={4} rounded={"md"}>
              <Box>
                {!isLoading && (currentUser?.bus?.['SECTOR']) &&  <Flex fontWeight={600} color={"gray.600"}>
                  <Text color={"gray.500"}>{`${currentUser?.bus?.['SECTOR']?.name}`}</Text>
                </Flex>}
                <Text fontWeight={600} fontSize={14} color="gray.400" textTransform={"capitalize"}>Hello {currentUser?.name}!</Text>
              </Box>
              <Flex onClick={() => setShowMenu(true)}>
                <Icon as={TbAlignRight} color="gray.600" fontSize={28} mr={3} />
              </Flex>
          </Flex>

          <Box mt={4}>
                <Flex justifyContent={"space-between"}>
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
                <Box mt={4}>
                    <Table variant="simple">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Name</Th>
                                <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Heads</Th>
                                <Th textTransform={"capitalize"} color={"gray.500"}>
                                    {/* <Icon as={TbDots}  fontSize={24} /> */}
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
                                  <Flex w={10} py={1} px={2} bg="gray.100" rounded={"md"} align={"center"} cursor={"pointer"} 
                                  onClick={() => {
                                    setSelectedGroup(item)
                                    onOpen()
                                  }}>
                                    <Icon as={TbBallpen} fontSize={20} color={"gray.600"}/>
                                  </Flex>
                                </Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
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
        </Box>
      </PageWrapper>
    </GuardWrapper>
  )
}
