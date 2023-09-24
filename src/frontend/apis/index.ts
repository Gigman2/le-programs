import { IBusAccount, IBusGroups, IBusRound } from "@/interface/bus";
import { IResponse } from "@/interface/misc";
import { ToastProps, createStandaloneToast } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

const { toast } = createStandaloneToast({
    defaultOptions: {
        duration: 2000,
        position: 'top-right',
        isClosable: true,
    },
});

const toastMessage: ToastProps = {
    position: 'top-right',
    duration: 9000,
    isClosable: true,
}


export function useBusGroups(type: string, enabled: boolean) {
    const { error, ...rest } = useQuery<IResponse<IBusGroups[]>>(["bus-groups", { accountType: type }], async () => {
        const { data } = await axios.get(
            `${baseUrl}/api/bus-groups?type=${type}`
        );
        return data;
    }, { enabled });

    if (error) {
        toastMessage.title = (error as any).message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}

export function useBusAccount({ name, group }: { name: string, group: string }, enabled: boolean) {
    const { error, ...rest } = useQuery<IResponse<IBusAccount[]>>(["bus-accounts", { name, group }], async () => {
        const { data } = await axios.get(
            `${baseUrl}/api/bus-accounts?name=${name}&group=${group}`
        );
        return data;
    }, { enabled });

    if (error) {
        toastMessage.title = (error as any).message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}

export const getBusGroupsApi = async () => {
    return await fetch(`${baseUrl}/api/bus_groups`, {
        method: 'get',
    })
}


export const removeBusRoundApi = async (bus: IBusRound) => {
    await fetch(`${baseUrl}/api/bus_rounds/${bus?._id}`, {
        method: 'DELETE'
    })
}

export const addBusRoundsApi = async (apiPayload: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds`, {
        method: 'post',
        body: JSON.stringify(apiPayload)
    })
}

export const addAttendeeApi = async (fields: Record<string, string | boolean | undefined>) => {
    return await fetch(`${baseUrl}/api/attendee/addAttendee`, {
        method: 'post',
        body: JSON.stringify(fields)
    })
}

export const recordBusRoundsApi = async (recorderPage: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds`, {
        method: 'post',
        body: JSON.stringify(recorderPage)
    })
}

export const createBusRoundsApi = async (recorderPayload: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds/addBusRounds`, {
        method: 'post',
        body: JSON.stringify(recorderPayload)
    })
}

export const addBusGroupApi = async (payload: any) => {
    return await fetch(`${baseUrl}/api/bus_groups/addGroup`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const getBusRoundsByBusIdApi = async (busId: string) => {
    return await fetch(`${baseUrl}/api/bus_rounds/${busId}`, {
        method: 'get',
    })
}

export const endBusRoundApi = async (id: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
        method: 'post',
        body: JSON.stringify({ busState: "ARRIVED", arrivalTime: new Date() })
    })
}

export const updateBusRoundsApi = async (id: any, payload: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const getBusGroupsPostApi = async (apiPayload: any) => {
    return await fetch(`${baseUrl}/api/bus_groups/getBusGroups`, {
        method: 'post',
        body: JSON.stringify(apiPayload)
    })
}

export const getHeadCountPostApi = async (payload: {}) => {
    return await fetch(`${baseUrl}/api/head_count/getHeadcount`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const addHeadCountApi = async (payload: any) => {
    return await fetch(`${baseUrl}/api/head_count/addHeadcount`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const getAttendeePostApi = async (reqData: any) => {
    return fetch(`${baseUrl}/api/attendee/getAttendee`, {
        method: 'post',
        body: JSON.stringify(reqData)
    })
}

export const getAttendeeInfoApi = async () => {
    return await fetch(`${baseUrl}/api/attendee/getAttendee`, {
        method: 'get',
    })
}

export const addAttendeeInfoApi = async (payload: any) => {
    return await fetch(`${baseUrl}/api/attendee/addAttendee`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}