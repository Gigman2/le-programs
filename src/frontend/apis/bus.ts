import { axiosInstance } from "../lib/axios"
const baseUrl = process.env.NEXT_PUBLIC_APP_URL

export interface CreateBusTripDTO {
    busOffering: number,
    totalPeople: number,
    busCost: number,
    vehicle?: string,
    event?: string
}
export const CreateBusTrip = <T>(payload: CreateBusTripDTO) => {
    const response = axiosInstance.post(`${baseUrl}/api/bus-rounds`, payload)
    return response as T
}
