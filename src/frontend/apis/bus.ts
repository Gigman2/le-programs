import { axiosInstance } from "../lib/axios"

export interface CreateBusTripDTO {
    busOffering: number,
    totalPeople: number,
    busCost: number,
    vehicle?: string,
    event?: string
}
export const CreateBusTrip = <T>(payload: CreateBusTripDTO) => {
    const response = axiosInstance.post(`/api/app-login`, payload)
    return response as T
}
