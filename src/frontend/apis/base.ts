import { IResponse } from "@/interface/misc";
import { ToastProps, createStandaloneToast } from "@chakra-ui/react";
import axios, { AxiosInstance } from "axios";
import { useQuery } from "react-query";
import { removeSession, setTokenExpiry } from "../store/auth";

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

const logout = () => {
    removeSession()
    window.location.href = '/bus/login';
}

// Create a custom axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        const tokenExpirationTime = response.headers['x-token-expires'];
        if (tokenExpirationTime) {
            setTokenExpiry(tokenExpirationTime);
        }
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || (error.response.status === 422 && error.response.data.message === 'TOKEN_EXPIRED'))) {
            logout();
        }
        
        return Promise.reject(error);
    }
);

export const LoginRequest = <T>(payload: { email: string; password: string }) => {
    return axiosInstance.post(`app-login`, payload);
}

export function useBasePostQuery<T>(url: string, query: Record<string, any> | null, reloadDep: Record<string, any>, enabled: boolean) {
    const { error, data, ...rest } = useQuery<IResponse<T>>([url, { url, ...query, ...reloadDep }], async () => {
        const res = await axiosInstance.post(url, query);
        return res.data;
    }, { enabled });

    if (error) {
        toastMessage.title = (error as any).message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, data,...rest }
}

export function useBaseGetQuery<T>(url: string, query: Record<string, any> | null, reloadDep: Record<string, any>, enabled: boolean) {
    const parsedQuery = new URLSearchParams()
    let path = url;

    if (query !== null) {
        for (const key in query) {
            if (typeof query[key] === 'object')
                parsedQuery.append(key, JSON.stringify(query[key]))
            else
                parsedQuery.append(key, query[key])
        }

        path = `${url}?${parsedQuery.toString()}`
    }

    const { error, data, ...rest } = useQuery<IResponse<T>>([url, { url, ...query, ...reloadDep }], async () => {
        const res = await axiosInstance.get(path);
        return res.data;
    }, { enabled });

    if (error) {
        toastMessage.title = (error as any).message || 'An error occurred'
        toastMessage.status = 'error'
        toast(toastMessage)
    }

    return { error, data, ...rest }
}

export const baseCreate = async <T, P>(url: string, payload: P) => {
    const response = await axiosInstance.post(url, payload);
    return response as T;
}
