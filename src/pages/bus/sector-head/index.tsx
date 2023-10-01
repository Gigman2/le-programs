/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Box, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { IAccountUser, getUser, removeSession, saveBusUser } from '@/frontend/store/auth'
import { useRouter } from 'next/router'
import { BsPersonFillAdd } from 'react-icons/bs'
import { MdAddBusiness } from 'react-icons/md'
import { TbAlignRight, TbHistory, TbLayoutBottombarCollapseFilled, TbPlus, TbPower, TbUsersGroup, TbX } from 'react-icons/tb'
import PageWrapper from '@/frontend/components/layouts/pageWrapper'
import { useActiveEvent, useBusGroupTree } from '@/frontend/apis'
import { GroupedUnits } from '@/frontend/components/Accounts/busingLogin'
import Menu from '@/frontend/components/Menu'
import GuardWrapper from '@/frontend/components/layouts/guardWrapper'
import { saveActiveEvent } from '@/frontend/store/event'
import AppWrapper from '@/frontend/components/layouts/appWrapper'



export default function BranchHead() {
  const [currentUser, setCurrentUser] = useState<IAccountUser>()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const MenuOptions = [
    {title: "Manage Branch", icon: TbLayoutBottombarCollapseFilled, fn: () => router.push(`/bus/sector-head/groups`)},
    {title: "Manage Bus Head", icon: TbUsersGroup, fn:  () => router.push(`/bus/sector-head/accounts`)},
    {title: "History", icon: TbHistory, fn:  ()=>{}},
    {title: "Logout", icon: TbPower, fn: removeSession}
  ]


  const {isLoading: eventLoading, data: eventData, error: eventError} = useActiveEvent(currentUser?.currentRole?.groupId as string, 
    !!currentUser?.currentRole?.groupId
  )

  useEffect(() => {
    if(eventData && !eventError){
      saveActiveEvent(eventData?.data)
    }
  },[eventData, eventError])

  useEffect(() => {
    const user = getUser() as IAccountUser
    if(!user) router.push('/bus/login')
    setCurrentUser(user)
  },[])

  return (
    <GuardWrapper allowed={['SECTOR_HEAD']} redirectTo='/bus/login' app='bus'>
      <AppWrapper>
          <Flex mt={4} align={"center"} justify={"space-between"}>
            {!eventLoading ? <Text fontWeight={600} color="gray.500"> {eventData?.data?.name}</Text> : <Skeleton h={6} w={"200px"} />}
          </Flex>

          <Box mt={4}>
            
          </Box>
      </AppWrapper>
    </GuardWrapper>
  )
}
