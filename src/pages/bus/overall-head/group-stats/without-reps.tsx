/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { TbChevronLeft} from 'react-icons/tb'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import AppWrapper from '@/frontend/components/layouts/appWrapper'
import { getSpecificBusData } from '@/frontend/store/bus'
import { IBusGroups } from '@/interface/bus'
import { useBaseGetQuery } from '@/frontend/apis/base'

export default function WithoutReps() {
    const [currentUser, setCurrentUser] = useState<IAccountUser>()
    const [extraData, setExtraData] = useState<string[]>()

    const router = useRouter()

    const {isLoading, data} = useBaseGetQuery<IBusGroups[]>(
        'bus-groups',
        {
        _id: {'$in': extraData}
    },
        {ids: extraData}, 
        !!extraData
    )



    useEffect(() => {
        const user = getUser() as IAccountUser
        setCurrentUser(user)

        const list = getSpecificBusData<string[]>('no-reps')
        setExtraData(list)
    },[])

  return (
    <GuardWrapper allowed={['OVERALL_HEAD']} redirectTo='/bus/login' app='bus'>
        <AppWrapper hideInfo={true}>
            <Flex gap={4} mt={4}>
                <Flex px={3} py={4} align={"center"} rounded={"md"} bg="gray.200" h={14} cursor={"pointer"}
                    onClick={() => router.back()}
                >
                    <Icon as={TbChevronLeft} fontSize={32} color={"gray.500"} />
                </Flex>
                <Box textAlign={"center"} p={4} bg="gray.400" rounded={"md"} color="white" mb={4} w="100%" h={14}>
                    Zones without bus reps
                </Box>
            </Flex>


            {isLoading ? <Skeleton rounded={"md"} h={12} w="100%" /> : 
            <Box my={6} maxHeight={"calc(100vh - 200px)"} overflowY={"scroll"}>
               {data?.data?.map(item => (
                    <Flex mb={3} key={item._id} fontWeight={600} color={"gray.500"} justify={"space-between"} p={4} rounded={"md"} bg="gray.100">
                        <Text>{item.name}</Text>
                        <Text>{(item?.fullParent as unknown as {name: string})?.name} Branch</Text>
                    </Flex>
               ))}
            </Box>}
      </AppWrapper>
    </GuardWrapper>
  )
}
