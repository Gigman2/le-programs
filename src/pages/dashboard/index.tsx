import React, { useEffect, useState } from "react";
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
  ToastProps,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import PageWrapper from "@/frontend/components/layouts/pageWrapper";
import useGetUser from "../../frontend/hooks/useGetUser";
import GuardWrapper from "@/frontend/components/layouts/guardWrapper";
import { addGroup, getUserGroups } from "@/frontend/apis";
import { isSuccess } from "@/utils/isSuccess";
import { getUser } from "@/frontend/store/auth";

const toastMessage: ToastProps = {
  position: "top-right",
  duration: 9000,
  isClosable: true,
};

function Dashboard() {
  const [items, setItems] = useState<{ id: string ; name: string }[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editingItemId, setEditingItemId] = useState<string>();
  const toast = useToast();
  const userData = getUser()
  const currentRole = userData?.currentRole as {groupType: string ,groupId: string}


  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    let { data } = await getUserGroups(
      currentRole.groupType === "BUS_HEAD" ? "ZONE" : "BRANCH",
      currentRole?.groupId
    );
    if (isSuccess(data?.statusCode)) {
      setItems(data.data.map((el: any) => ({ id: el._id, name: el.name })));
    }
  };

  const handleCreateItem = async () => {
    if (newItem.trim() === "") return;

    const newItemObject = { id: Date.toString(), name: newItem };
    let res:any  = await addGroup([
      {
        name: newItem,
        parent: currentRole.groupId,
        type: currentRole.groupType === "BUS_HEAD" ? "ZONE" : "BRANCH",
      },
    ]);

    if (isSuccess(res?.statusCode)) {
      toast({
        ...toastMessage,
        status: "success",
        title: res.message || "Success",
      });
      setItems(prev => ([...prev, newItemObject]));
      setNewItem("");
    } else {
      toast({
        ...toastMessage,
        status: "error",
        title: res.message || "Something went wrong",
      });
    }
  };

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
  };

  const handleUpdateItem = (id: string | number, updatedName: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: updatedName } : item
    );
    setItems(updatedItems);

    // setEditingItemId(null);
  };

  const handleDeleteItem = (id: string | number) => {
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
                    currentRole?.groupType === "BUS_HEAD"
                      ? "New Zone"
                      : "New Branch"
                  }
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                <Button
                  colorScheme="blackAlpha"
                  size="sm"
                  mt={3}
                  p={4}
                  onClick={handleCreateItem}
                >
                  <AddIcon /> Add
                </Button>
              </Box>

              
            </Container>
          </ChakraProvider>
        </Box>
      </PageWrapper>
    </GuardWrapper>
  );
}

export default Dashboard;
