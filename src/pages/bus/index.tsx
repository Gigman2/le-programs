/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Text } from '@chakra-ui/react'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useEffect, useRef, useState } from 'react'
import { IAccountUser, getUser } from '@/utils/auth'
import { useRouter } from 'next/router'
import { IBusAccount } from '@/interface/bus'
import useHover from '@/frontend/hooks/useHover'

const RoleSelection = ({data}: {data: IBusAccount['accountType'][0]}) => {
    const ref = useRef(null);
    const isHovered = useHover(ref);
    const router = useRouter()
    return (
        <Box ref={ref} 
            cursor={"pointer"} mb={4} 
            color={isHovered ? "white" : "blackAlpha.700"}
            rounded={"md"} bg={isHovered ? "blackAlpha.900" : "white"} 
            p={4} borderColor={"gray.300"} borderWidth={1} w="100%"
            onClick={() => router.push(`/bus/${data.groupType.replace("_","-").toLowerCase()}`)}
        >
            Continue as a {data.groupType.replace("_", " ").toLowerCase()}
        </Box>
    )
}


export default function BusHome() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<IAccountUser>()


    useEffect(() => {
        const user = getUser() as IAccountUser
        if(user?.roles?.length === 1){
            const role = user?.roles?.[0]?.groupType
            router.push(`/bus/${role.replace("_","-").toLowerCase()}`)
        }
        setCurrentUser(user)
    },[])

    return (
        <GuardWrapper allowed={["BUS_REP", "BRANCH_HEAD", "SECTOR_HEAD", "OVERALL_ADMIN"]} app="bus">
            <PageWrapper>
                <Box minW="370px">
                    <Box mt={4}>
                        <Box>
                            <Text fontSize={20} fontWeight={600} color={"gray.600"}>Welcome {currentUser?.name}</Text>
                        </Box>
                    </Box>

                    <Box mt={12}>
                        {currentUser?.roles?.map(item => (
                            <RoleSelection key={item.groupType} data={item} />
                        ))}
                    </Box>
                </Box>
            </PageWrapper>
        </GuardWrapper>
  )
}
