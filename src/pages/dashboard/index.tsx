import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Heading,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import PageWrapper from '@/frontend/components/layouts/pageWrapper';
import useGetUser from '../../frontend/hooks/useGetUser';
import GuardWrapper from '@/frontend/components/layouts/guardWrapper';

function Dashboard() {
  const [items, setItems] = useState< {id:string,name:string}[]>([]);
  const [isUserRole] =  useGetUser()
  const [newItem, setNewItem] = useState('');
  const [editingItemId, setEditingItemId] = useState<string>();

  const handleCreateItem = () => {
    if (newItem.trim() === '') return;
    const newItemObject = { id: Date.now(), name: newItem };
    setItems([...items, newItemObject]);
    setNewItem('');
  };

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
  };

  const handleUpdateItem = (id: number, updatedName: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: updatedName } : item
    );
    setItems(updatedItems);
    
    // setEditingItemId(null);
  };

  const handleDeleteItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  return (
    <GuardWrapper allowed={[ "BRANCH_HEAD", "SECTOR_HEAD",]} app="bus" redirectTo='bus/login'>
          <PageWrapper>
              <Box maxW={"500px"} w="100%" position={"relative"}>

              <ChakraProvider>
      <Container maxW="container.lg" py={5}>
        <Heading mb={4}>Dashboard</Heading>

        <Box mb={4} display={"flex"} flexDirection={"column"} alignItems={"flex-end"}>
          <Input
            type="text"
            placeholder={isUserRole(['BRANCH_HEAD'])?"New Zone":'New Branch'}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button
            colorScheme="blackAlpha"
            size="sm"
            mt={3}
            onClick={handleCreateItem}
          >
            <AddIcon /> Add
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>
                  {editingItemId === String(item.id) ? (
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateItem(item.id, e.target.value)
                      }
                    />
                  ) : (
                    item.name
                  )}
                </Td>
                <Td>
                  {editingItemId === String(item.id) ? (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => setEditingItemId(undefined)}
                    >
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        colorScheme="orange"
                        size="sm"
                        mr={2}
                        onClick={() => handleEditItem(String(item.id))}
                      >
                        <EditIcon /> Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon /> Delete
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </ChakraProvider>
</Box>

    </PageWrapper>
</GuardWrapper>
  

    
  );
}

export default Dashboard;
