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
  const [editingItemId, setEditingItemId] = useState(null);

  const handleCreateItem = () => {
    if (newItem.trim() === '') return;
    const newItemObject = { id: Date.now(), name: newItem };
    setItems([...items, newItemObject]);
    setNewItem('');
  };

  const handleEditItem = (id) => {
    setEditingItemId(id);
  };

  const handleUpdateItem = (id, updatedName) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: updatedName } : item
    );
    setItems(updatedItems);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id) => {
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
                  {editingItemId === item.id ? (
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
                  {editingItemId === item.id ? (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleUpdateItem(item.id, item.name)}
                    >
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        colorScheme="orange"
                        size="sm"
                        mr={2}
                        onClick={() => handleEditItem(item.id)}
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
