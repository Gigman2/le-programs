import { IBusAccount, IBusGroups, IBusRound } from "@/interface/bus";
import { IEvent } from "@/interface/events";
import { IResponse } from "@/interface/misc";
import { ToastProps, createStandaloneToast } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";
import { axiosInstance } from "../lib/axios";

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


export function useBusGroups(query: Record<string, any>, reloadDep: Record<string, any>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const parsedQuery = new URLSearchParams()
    for (const key in query) {
        if (typeof query[key] === 'object')
            parsedQuery.append(key, JSON.stringify(query[key]))
        else
            parsedQuery.append(key, query[key])
    }

    const { error, ...rest } = useQuery<IResponse<IBusGroups[]>>(["bus-groups", { ...query, ...reloadDep }], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/bus-groups?${parsedQuery.toString()}`, { headers: { 'Authorization': "Bearer " + token } }
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

export function useGetAccounts(query: Record<string, string>, reloadDep: Record<string, string>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const parsedQuery = new URLSearchParams(query).toString()
    const { error, ...rest } = useQuery<IResponse<IBusAccount[]>>(["bus-accounts", { ...query, ...reloadDep }], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/bus-accounts?${parsedQuery.toString()}`, { headers: { 'Authorization': "Bearer " + token } }
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

export function useBusAccount(query: Record<string, any>, reloadDep: Record<string, any>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IBusAccount[]>>(["bus-accounts", { ...query, ...reloadDep }], async () => {
        const { data } = await axios.post(
            `${baseUrl}/api/bus-accounts/all`, query, { headers: { 'Authorization': "Bearer " + token } }
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

export function useBusGroupTree(key: string, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IBusGroups[]>>(["bus-group-tree", { group: key }], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/bus-groups/tree?_id=${key}`, { headers: { 'Authorization': "Bearer " + token } }
        );
        return data;
    }, { enabled });
    if (error) {
        const _error = error as any
        toastMessage.title = _error?.response?.data.message || _error.message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}

export function useActiveEvent(key: string, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IEvent>>(["active-event", { group: key }], async () => {
        const { data } = await axios.post(
            `${baseUrl}/api/events/active`, { headers: { 'Authorization': "Bearer " + token } }
        );
        return data;
    }, { enabled });
    if (error) {
        const _error = error as any
        toastMessage.title = _error?.response?.data?.message || _error?.message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}

export function useEventZoneSummary(key: string, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<
        {
            busInfo: { total_buses: number, arrived: number, on_route: number };
            peopleInfo: { people: number, arrived: number, on_route: number };
            financeInfo: { offering: number, cost: number };
            notStarted: string[];
            unMetTarget: string[];
            zones: Record<string, IBusRound[]>
        }>>(["zone-summary", { group: key }], async () => {
            const { data } = await axios.get(
                `${baseUrl}/api/bus-rounds/zone-summary/${key}`, { headers: { 'Authorization': "Bearer " + token } }
            );
            return data;
        }, { enabled });
    if (error) {
        const _error = error as any
        toastMessage.title = _error?.response?.data?.message || _error?.message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}


export function useBusTrips({ event, zone }: { event: string; zone: string }, queryKey: Record<string, string | boolean>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IBusRound[]>>(["bus-rounds", queryKey], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/bus-rounds?event=${event}&busZone=${zone}`, {
            headers: { 'Authorization': "Bearer " + token },
        }
        );
        return data;
    }, { enabled });
    if (error) {
        const _error = error as any
        toastMessage.title = _error?.response?.data.message || _error.message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, ...rest }
}




export const LoginRequest = <T>(payload: { email: string; password: string }) => {
    const response = axios.post(`/api/app-login`, payload)
    return response as T
}

export const addGroup = <T>(payload: { name: string; type: string; parent: string, stations?: string[] }[]) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    const response = axiosInstance.post(baseUrl + `/api/bus-groups`, payload, { headers: { 'Authorization': "Bearer " + token } })
    return response as T
}


export const updateGroup = <T>(id: string, payload: { name: string; type: string; parent: string, stations?: string[] }[]) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    const response = axiosInstance.post(baseUrl + `/api/bus-groups/${id}`, payload, { headers: { 'Authorization': "Bearer " + token } })
    return response as T
}

export const updateUser = <T>(id: string, payload: { name: string; type: string; parent: string, stations?: string[] }[]) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    const response = axiosInstance.post(baseUrl + `/api/bus-accounts/${id}`, payload, { headers: { 'Authorization': "Bearer " + token } })
    return response as T
}


export const getUserGroups = async (type: string, groupId: string) => {
    return await axiosInstance.get(
        `${baseUrl}/api/bus-groups?type=${type}&parent=${groupId}`,
    );
}


export const addUser = async (data: { name: string; email: string }) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    return await axiosInstance.post(
        `${baseUrl}/api/bus-accounts`,
        data, { headers: { 'Authorization': "Bearer " + token } }
    );
}


export const assignUserToGroup = async (data: { userId: string; groupId: string }) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    return await axiosInstance.post(
        `${baseUrl}/api/bus-accounts/assignUser`,
        data, { headers: { 'Authorization': "Bearer " + token } }
    );
}


export const getAccounts = async (id: string) => {
    return await axiosInstance.get(
        `${baseUrl}/api/bus-accounts?accountType.groupId=${id}`,
    );
}
