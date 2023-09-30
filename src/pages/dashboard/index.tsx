import React, { useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import PageWrapper from "@/frontend/components/layouts/pageWrapper";
import useGetUser from "../../frontend/hooks/useGetUser";
import GuardWrapper from "@/frontend/components/layouts/guardWrapper";
import { addGroup } from "@/frontend/apis";

function Dashboard() {
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [isUserRole,d , currentRole] = useGetUser();
  const [newItem, setNewItem] = useState("");
  const [editingItemId, setEditingItemId] = useState<string>();

  const handleCreateItem = async () => {
    if (newItem.trim() === "") return;

    const newItemObject = { id: Date.now(), name: newItem };
    await addGroup([
      {
        name: newItem,
        parent: currentRole() === "BUS_HEAD" ? "BRANCH" : "SECTOR",
        type: currentRole() === "BUS_HEAD" ? "ZONE" : "BRANCH",
      },
    ]);
    setItems([...items, newItemObject]);
    setNewItem("");
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

  const save = async () => {
    // await addGroup([])
    setEditingItemId(undefined);
  };

  return (
    <GuardWrapper
      allowed={["BUS_HEAD", "SECTOR_HEAD"]}
      app="bus"
      redirectTo="bus/login"
    >
      <PageWrapper>
        <Box maxW={"500px"} w="100%" position={"relative"}>
          <ChakraProvider>
            <Container maxW="container.lg" py={5}>
              <Heading mb={4}>Group Management</Heading>

              <Box
                mb={4}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"flex-end"}
              >
                <Input
                  type="text"
                  placeholder={
                    isUserRole(["BUS_HEAD"]) ? "New Zone" : "New Branch"
                  }
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
                          <Button colorScheme="blue" size="sm" onClick={save}>
                            Save
                          </Button>
                        ) : (
                          <Box display={"flex"} flexDirection={"row"}>
                            <Button
                              // colorScheme="orange"
                              size="sm"
                              mr={2}
                              onClick={() => handleEditItem(String(item.id))}
                            >
                              <EditIcon /> Edit
                            </Button>
                            <Button
                              // colorScheme="red"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <DeleteIcon /> Delete
                            </Button>
                          </Box>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                {items.length == 0 && (
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
              </Table>
            </Container>
          </ChakraProvider>
        </Box>
      </PageWrapper>
    </GuardWrapper>
  );
}

export default Dashboard;
