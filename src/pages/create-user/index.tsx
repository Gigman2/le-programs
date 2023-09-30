
import React, { useState } from 'react';
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
import { addUser ,assignUserToGroup} from '@/frontend/apis';

function CreateUser() {
  const [user, setUser] = useState({ email: '', name: '', group: '' });
  const [groups] = useState(['Group A', 'Group B', 'Group C']);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const [isUserRole, getUserData, currentRole] = useGetUser();

  let userCurrentRole = currentRole();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.email && user.name && user.group) {
      // Create a new user object with the current user state
      const newUser = { email:user.email ,name:user.name};
      // newUser.group = null
      let response = await addUser(user)

      console.log('-handleSubmit');
      console.log(response);
      

      // let res = await assignUserToGroup({userId, groupId})
      // Add the new user to the list of created users
      setCreatedUsers([...createdUsers, newUser]);
      // Reset the user state to clear the form fields
      setUser({ email: '', name: '', group: '' });
    } else {
      alert('Please fill in all fields.');
    }
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

  return (
    <PageWrapper>
    <Box maxW={"500px"} w="100%" position={"relative"}>
      <Text fontSize="xl" mb={4}>
        Create {userCurrentRole.groupType === "BUS_HEAD"
                      ? "New Zone"
                      : "New Branch"}
      </Text>
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
              {groups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
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
          {sortedUsers.map((createdUser, index) => (
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
