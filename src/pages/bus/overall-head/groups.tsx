/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Icon, Table, Text, Thead, Tbody, Tr, Th, Td,  Skeleton, Flex, useDisclosure } from '@chakra-ui/react'
import { IAccountUser, getUser} from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import {  TbPlus, TbBallpen } from 'react-icons/tb'
import {  useBusGroups } from '@/frontend/apis'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper' 
import AddBusGroup from '@/frontend/components/Modals/addBusGroup'
import { IBusGroups } from '@/interface/bus'
import AppWrapper from '@/frontend/components/layouts/appWrapper'



export default function OverallGroups() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const [selectedGroup, setSelectedGroup] = useState<IBusGroups>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

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
            <Box mt={4}>
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Name</Th>
                            <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Bus Reps</Th>
                            <Th textTransform={"capitalize"} fontSize={17}  color={"gray.400"}>Stations</Th>
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
                                0
                            </Td>
                              <Td>
                                {item.station.length}
                            </Td>
                            <Td>
                              <Flex gap={2} py={1} px={2} bg="gray.100" rounded={"md"} align={"center"} cursor={"pointer"} 
                              onClick={() => {
                                setSelectedGroup(item)
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
