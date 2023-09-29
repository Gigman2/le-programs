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

function Dashboard() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

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
    <ChakraProvider>
      <Container maxW="container.lg" py={5}>
        <Heading mb={4}>Dashboard</Heading>

        <Box mb={4} display={"flex"} flexDirection={"column"} alignItems={"flex-end"}>
          <Input
            type="text"
            placeholder="New Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button
            colorScheme="teal"
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
                      onClick={() => setEditingItemId(String(item.id))}
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
  );
}

export default Dashboard;
