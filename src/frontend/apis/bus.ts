// import { useQuery } from "react-query"
// import { axiosInstance } from "../lib/axios"
// import { IResponse } from "@/interface/misc"
// import { ToastProps, createStandaloneToast } from "@chakra-ui/react"
// import { IVehicle } from "@/interface/vehicle"
// import { IBusAccount, IBusGroups } from "@/interface/bus"
// const baseUrl = process.env.NEXT_PUBLIC_APP_URL

// const { toast } = createStandaloneToast({
//     defaultOptions: {
//         duration: 2000,
//         position: 'top-right',
//         isClosable: true,
//     },
// });

// const toastMessage: ToastProps = {
//     position: 'top-right',
//     duration: 9000,
//     isClosable: true,
// }


// export const CreateBusTrip = <T>(payload: CreateBusTripDTO) => {
//     let token = ''
//     if (typeof window !== "undefined") {
//         token = localStorage.getItem('auth_token') as string
//     }

//     const response = axiosInstance.post(`${baseUrl}/api/bus-rounds`, payload, { headers: { 'Authorization': "Bearer " + token } })
//     return response as T
// }




// export const updateBusLog = <T>(id: string, payload: AddStopPointDTO) => {
//     let token = ''
//     if (typeof window !== "undefined") {
//         token = localStorage.getItem('auth_token') as string
//     }

//     const response = axiosInstance.post(`${baseUrl}/api/bus-rounds/${id}`, payload, { headers: { 'Authorization': "Bearer " + token } })
//     return response as T
// }



// export function useBusVehicles(type: string, enabled: boolean) {
//     let token: string
//     if (typeof window !== "undefined") {
//         token = localStorage.getItem('auth_token') as string
//     }
//     const { error, ...rest } = useQuery<IResponse<IVehicle[]>>(["vehicle", { accountType: type }], async () => {
//         const { data } = await axiosInstance.get(
//             `${baseUrl}/api/vehicle`, { headers: { 'Authorization': "Bearer " + token } }
//         );
//         return data;
//     }, { enabled });

//     if (error) {
//         toastMessage.title = (error as any).message || 'An error occurred'
//         toastMessage.status = 'error'
//         toast(toastMessage)
//     }

//     return { error, ...rest }
// }

// export function useSingleBusGroup(id: string, enabled: boolean) {
//     let token: string
//     if (typeof window !== "undefined") {
//         token = localStorage.getItem('auth_token') as string
//     }
//     const { error, ...rest } = useQuery<IResponse<IBusGroups>>(["bus-groups", id], async () => {
//         const { data } = await axiosInstance.get(
//             `${baseUrl}/api/bus-groups/${id}`, { headers: { 'Authorization': "Bearer " + token } }
//         );
//         return data;
//     }, { enabled });

//     if (error) {
//         toastMessage.title = (error as any).message || 'An error occurred'
//         toastMessage.status = 'error'
//         toast(toastMessage)
//     }

//     return { error, ...rest }
// }


// export function useSingleBusAccount(id: string, enabled: boolean) {
//     let token: string
//     if (typeof window !== "undefined") {
//         token = localStorage.getItem('auth_token') as string
//     }
//     const { error, ...rest } = useQuery<IResponse<IBusAccount>>(["bus-groups", id], async () => {
//         const { data } = await axiosInstance.get(
//             `${baseUrl}/api/bus-accounts/${id}`, { headers: { 'Authorization': "Bearer " + token } }
//         );
//         return data;
//     }, { enabled });

//     if (error) {
//         toastMessage.title = (error as any).message || 'An error occurred'
//         toastMessage.status = 'error'
//         toast(toastMessage)
//     }

//     return { error, ...rest }
// }
