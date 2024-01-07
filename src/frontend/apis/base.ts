import { IResponse } from "@/interface/misc";
import { ToastProps, createStandaloneToast } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

const { toast } = createStandaloneToast({
    defaultOptions: {
        duration: 2000,
        position: 'bottom-right',
        isClosable: true,
    },
});

const toastMessage: ToastProps = {
    position: 'bottom-right',
    duration: 9000,
    isClosable: true,
}

export const LoginRequest = <T>(payload: { email: string; password: string }) => {
    const response = axios.post(`/api/app-login`, payload)
    return response as T
}

export function useBasePostQuery<T>(url: string, query: Record<string, any> | null, reloadDep: Record<string, any>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    const { error, ...rest } = useQuery<IResponse<T>>([url, { url, ...query, ...reloadDep }], async () => {
        const { data } = await axios.post(
            `${baseUrl}/api/${url}`, query, { headers: { 'Authorization': "Bearer " + token } }
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

export function useBaseGetQuery<T>(url: string, query: Record<string, any> | null, reloadDep: Record<string, any>, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const parsedQuery = new URLSearchParams()
    let path = `${baseUrl}/api/${url}}`

    if (query !== null) {
        for (const key in query) {
            if (typeof query[key] === 'object')
                parsedQuery.append(key, JSON.stringify(query[key]))
            else
                parsedQuery.append(key, query[key])
        }

        path = `${baseUrl}/api/${url}?${parsedQuery.toString()}`
    }

    const { error, ...rest } = useQuery<IResponse<T>>([url, { url, ...query, ...reloadDep }], async () => {
        const { data } = await axios.get(
            `${path}`, { headers: { 'Authorization': "Bearer " + token } }
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



export const baseCreate = async <T, P>(url: string, payload: P) => {
    let token = ''
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }

    const response = await axios.post(`${baseUrl}/api/${url}`, payload, { headers: { 'Authorization': "Bearer " + token } })
    return response as T
}