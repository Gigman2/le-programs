import { useQuery } from "react-query"
import { axiosInstance } from "../lib/axios"
import { IResponse } from "@/interface/misc"
import { ToastProps, createStandaloneToast } from "@chakra-ui/react"
import { IVehicle } from "@/interface/vehicle"
import { IBusGroups } from "@/interface/bus"
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
export interface CreateBusTripDTO {
    busOffering: number,
    people: number,
    busCost: number,
    vehicle?: string,
    event?: string
    recordedBy?: string
    busZone?: string
    busState?: 'EN_ROUTE' | 'ARRIVED'
}


export const CreateBusTrip = <T>(payload: CreateBusTripDTO) => {
    const response = axiosInstance.post(`${baseUrl}/api/bus-rounds`, payload)
    return response as T
}


export interface AddStopPointDTO {
    people: number,
    stopPoints: [{
        location: string;
        people: number
    }],
}

export const addStopPoint = <T>(id: string, payload: AddStopPointDTO) => {
    const response = axiosInstance.post(`${baseUrl}/api/bus-rounds/${id}`, payload)
    return response as T
}



export function useBusVehicles(type: string, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IVehicle[]>>(["vehicle", { accountType: type }], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/vehicle`
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


export function useSingleBusGroup(key: string, enabled: boolean) {
    let token: string
    if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token') as string
    }
    const { error, ...rest } = useQuery<IResponse<IBusGroups>>(["bus-groups", key], async () => {
        const { data } = await axiosInstance.get(
            `${baseUrl}/api/bus-groups/${key}`
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