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

