import { IBusRound } from '@/interface/bus';
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react'
import { TbCheck, TbMapPinPlus } from 'react-icons/tb';


const CardItem = ({name, value, myLog}: {name: string; value: string | number, myLog: boolean}) => {
  return (
    <Flex align={"center"} gap={3}>
      <Text fontSize={13} color={myLog ? "whiteAlpha.800" : "gray.600"}>{name}</Text>
      <Text textTransform={"capitalize"} fontSize={14} fontWeight={600} color={myLog ? "white" : "blackAlpha.700"}>{value}</Text>
    </Flex>
  )
}

export default function BusCard (
  {item, index, ended, myLog, openCheckin, openEndTrip, setSelectedRecord}: 
  {
    index:number; item: IBusRound; 
    ended: boolean; myLog?: boolean, 
    openCheckin: () => void; openEndTrip: () => void;
    setSelectedRecord: Dispatch<SetStateAction<IBusRound | undefined>>
  }) {
  return (
    <Box mb={8}>
        <Text fontSize={13} color={"gray.600"}>{dayjs(item.updated_on).format('ddd D, MMMM H:m A')}</Text>
        <Box bg={myLog ? "blackAlpha.800" : "gray.100"} p={3} borderColor={myLog ? "black" :"gray.200"} borderWidth={1} rounded={"md"}>
          <Flex align={"center"} justify={"space-between"} mb={2}>
            <Text color={myLog ? "white" : "blackAlpha.700"} fontSize={13}>
              <Text as="span" fontWeight={600}>Bus {index + 1}</Text>{item.lastCheckPoint ? ' | Currently at' + 
              <Text as="span" fontWeight={600} fontSize={14}> {item.lastCheckPoint}</Text>: null}
            </Text>: <Text></Text>

            {myLog ? 
            (
              <>
                {ended ? <Text color={"green.500"} fontWeight={600}>Arrived</Text>
                :<Flex gap={4}>
                  <Box as={Button}  p={3} bg="white" onClick={() => {
                    setSelectedRecord(item)
                    openCheckin()
                  }}>
                    <Icon as={TbMapPinPlus} color="blackAlpha.800" fontSize={24}/>
                  </Box>
                  <Box as={Button}  p={3} bg="white" onClick={() => {
                    setSelectedRecord(item)
                    openEndTrip()
                  }}>
                    <Icon as={TbCheck} color="blackAlpha.800" fontSize={24}/>
                  </Box>
                </Flex>}
              </>
            )
            : <Box 
              bg={"transparent"} 
              color={ended ? "green.400" : "blue.500"} 
              px={4} rounded={"md"}
              borderColor={"gray.500"}
              fontWeight={600}
            >
              {ended ? 'Arrived' : "En-Route"}
            </Box>}
          </Flex>
          <Box w={"100%"} h={"1px"} bg="gray.300" />
          <Flex mt={1} justify={"space-between"}>
              <CardItem name={'Started by'} value={(item.recordedBy as unknown as {name:string})?.name as string} myLog={!!myLog} />
              <CardItem name={'Started on'} value={dayjs(item.created_on).format('h:mm A')} myLog={!!myLog} />
          </Flex>
          <Flex mt={1} justify={"space-between"}>
              <CardItem name={'Bus Cost'} value={"Ghc "+item.busCost} myLog={!!myLog} />
              {item.busState === "ARRIVED" ? <CardItem name={'Ended on'} value={item.arrivalTime} myLog={!!myLog} /> : null}
          </Flex>
          <Flex mt={1} justify={"space-between"}>
              {item.people > 0 ? <CardItem name={'People in bus'} value={item.people} myLog={!!myLog} /> : null}
              {item.busOffering > 0 ? <CardItem name={'Offering received'} value={'Ghc '+ item.busOffering} myLog={!!myLog} /> : null}
          </Flex>
        </Box>
    </Box>
)}