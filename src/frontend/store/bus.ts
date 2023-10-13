import { IEvent } from "@/interface/events"

export const saveExtraBusRecord = (data: { notStarted?: string[], unMetTarget?: string[] }) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem('bus_record', JSON.stringify(data))
    }
}

export const getExtraBusRecord = () => {
    if (typeof window !== "undefined") {
        const data = sessionStorage.getItem('bus_record')
        return JSON.parse(data as string) as { notStarted?: string[], unMetTarget?: string[] }
    }
}


export const saveBusData = async (key: string, data: string | string[] | Record<string, any>) => {
    if (typeof window !== "undefined") {
        let savedData = await getAllBusData() || {}
        savedData = { ...savedData, [key]: data }
        sessionStorage.setItem('bus_data', JSON.stringify(savedData))
    }
}

export const getSpecificBusData = (key: string) => {
    if (typeof window !== "undefined") {
        const data = sessionStorage.getItem('bus_data')
        const retrievedData = JSON.parse(data as string) as Record<string, any>
        return retrievedData[key]
    }
}


export const getAllBusData = () => {
    if (typeof window !== "undefined") {
        const data = sessionStorage.getItem('bus_data')
        return JSON.parse(data as string) as Record<string, any>
    }
}

