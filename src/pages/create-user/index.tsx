
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import PageWrapper from '@/frontend/components/layouts/pageWrapper';
import useGetUser from '@/frontend/hooks/useGetUser';
import assignUser from '../api/bus-accounts/assignUser';
import { addUser ,assignUserToGroup, getAccounts, useBusAccount, useBusGroups, useGetAccounts} from '@/frontend/apis';
import { isSuccess } from '@/utils/isSuccess';

function CreateUser() {
  const [user, setUser] = useState({ email: '', name: '', group: '' });
  const [groups] = useState(['Group A', 'Group B', 'Group C']);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [loading, setLoading] = useState(false)

  const [isUserRole, getUserData, currentRole] = useGetUser();
  
  let userCurrentRole = currentRole() as unknown as {group: string; groupId: string};
  
  const {isLoading, data : groupTree} = useBusGroups(
    {parent: userCurrentRole.groupId},
    {parent: userCurrentRole.groupId}, 
    !!(userCurrentRole.groupId)
  )
  // const {data : _createdUsers} = useGetAccounts({"accountType.groupId": userCurrentRole.groupId}, 
  // {},
  //   !!(userCurrentRole.groupId)
  // )

  useEffect(() => {
    getUsers()
  }, [])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true)
    if (user.email && user.name && user.group) {
      // Create a new user object with the current user state
      const newUser = { email:user.email ,name:user.name};
      // newUser.group = null
      let response = await addUser(user)

      if (isSuccess(response.data.statusCode)) {
        
        let res = await assignUserToGroup({groupId:user.group, userId:response.data.data.data._id})
        
        console.log('-handleSubmit');
        console.log(response);
        
        
        setUser({ email: '', name: '', group: '' });
        getUsers()
      }
    } else {
      alert('Please fill in all fields.');
    }
    setLoading(false)
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...createdUsers].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key].localeCompare(b[sortConfig.key]);
    } else {
      return b[sortConfig.key].localeCompare(a[sortConfig.key]);
    }
  });

  const save = async () =>{


   let response = await addUser(user)

  //  let res = await assignUserToGroup({userId, groupId})
  }


  const getUsers = async ()=>{
   let {data} = await  getAccounts(userCurrentRole.groupId)
   console.log(data);
   
   if (isSuccess(data.statusCode)) {
    setCreatedUsers(data.data)
   }
  }
  return (
    <PageWrapper>
    <Box maxW={"500px"} w="100%" position={"relative"}>
      {/* <Text fontSize="xl" mb={4}>
        Create {(userCurrentRole?.groupType === "BUS_HEAD")
                      ? " Bus Rep"
                      : " Branch"}
      </Text> */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <Input
              type="text"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Group:</FormLabel>
            <Select
              name="group"
              value={user.group}
              onChange={handleInputChange}
              placeholder="Select a group"
            >
              {groupTree?.data.map((group, index) => (
                <option key={index} value={group._id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blackAlpha"
            leftIcon={<CheckIcon />}
          >
            Create User
          </Button>
        </Stack>
      </form>
      <Text fontSize="xl" mt={8} mb={4}>
        Created Users
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th onClick={() => handleSort('name')}>
              Name
              {sortConfig.key === 'name' && (
                <Box as="span" ml={1}>
                  {sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )}
                </Box>
              )}
            </Th>
            <Th onClick={() => handleSort('email')}>
              Email
              {sortConfig.key === 'email' && (
                <Box as="span" ml={1}>
                  {sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )}
                </Box>
              )}
            </Th>
            <Th onClick={() => handleSort('group')}>
              Group
              {sortConfig.key === 'group' && (
                <Box as="span" ml={1}>
                  {sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronDownIcon />
                  )}
                </Box>
              )}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {createdUsers.map((createdUser, index) => (
            <Tr key={index}>
              <Td>{createdUser.name}</Td>
              <Td>{createdUser.email}</Td>
              <Td>{createdUser.group}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
        {(sortedUsers.length == 0 || !sortedUsers) && (
                  <Box
                    display={"flex"}
                    position={"absolute"}
                    left={0}
                    right={0}
                    justifyContent={"center"}
                    alignItems={"center"}
                    textAlign={"center"}
                  >
                    <Text>No Data</Text>
                  </Box>
                )}
    </Box>
    </PageWrapper>
  );
}

export default CreateUser;
