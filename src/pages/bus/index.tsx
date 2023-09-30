/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Text } from '@chakra-ui/react'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useEffect, useRef, useState } from 'react'
import { IAccountUser, getUser, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import useHover from '@/frontend/hooks/useHover'

const RoleSelection = ({data, user}: {data: any; user: IAccountUser}) => {
    const ref = useRef(null);
    const isHovered = useHover(ref);
    const router = useRouter()

    const gotoRole = () => {
        const account = user
        saveBusUser({...account, currentRole: data})
        router.push(`/bus/${data.groupType.replace("_","-").toLowerCase()}`)
    }
    return (
        <Box ref={ref} 
            cursor={"pointer"} mb={4} 
            color={isHovered ? "white" : "blackAlpha.700"}
            rounded={"md"} bg={isHovered ? "blackAlpha.900" : "white"} 
            p={4} borderColor={"gray.300"} borderWidth={1} w="100%"
            onClick={() => gotoRole()}
        >
            Continue as a {data.groupType.replace("_", " ").toLowerCase()}
        </Box>
    )
}


export default function BusHome() {
    const [currentUser, setCurrentUser] = useState<IAccountUser>()


    useEffect(() => {
        const user = getUser() as IAccountUser
        setCurrentUser(user)
    },[])

    return (
        <GuardWrapper allowed={["BUS_REP", "BRANCH_HEAD", "SECTOR_HEAD", "OVERALL_ADMIN"]} app="bus" redirectTo='bus/login'>
            <PageWrapper>
                <Box minW="370px">
                    <Box mt={4}>
                        <Box>
                            <Text fontSize={20} fontWeight={600} color={"gray.600"}>Welcome {currentUser?.name}</Text>
                        </Box>
                    </Box>

                    <Box mt={12}>
                        {currentUser?.roles?.map(item => (
                            <RoleSelection key={item.groupType} data={item} user={currentUser} />
                        ))}
                    </Box>
                </Box>
            </PageWrapper>
        </GuardWrapper>
  )
}
