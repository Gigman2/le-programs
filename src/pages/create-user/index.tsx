
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

function CreateUser() {
  const [user, setUser] = useState({ email: '', name: '', group: '' });
  const [groups] = useState(['Group A', 'Group B', 'Group C']);
  const [createdUsers, setCreatedUsers] = useState([
    {name:'Kelvin Portuphy',email:'ofolikelvin@gmail.com',group:'Group A'},
    {name:'Ofoli Portuphy',email:'ofolikelvin@gmail.com',group:'Group B'},
    {name:'Kelvin Portuphy',email:'ofolikelvin@gmail.com',group:'Group A'},
    {name:'Azanda',email:'ofolikelvin@gmail.com',group:'Group A'},
    {name:'Richard',email:'ofolikelvin@gmail.com',group:'Group C'}
  ]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.email && user.name && user.group) {
      // Create a new user object with the current user state
      const newUser = { ...user };
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

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Create User
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
            colorScheme="teal"
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
    </Box>
  );
}

export default CreateUser;
