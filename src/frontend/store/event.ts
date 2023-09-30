import { IEvent } from "@/interface/events"

export const saveActiveEvent = (data: IEvent) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem('active_event', JSON.stringify(data))
    }
}

export const getActiveEvent = () => {
    if (typeof window !== "undefined") {
        sessionStorage.getItem('active_event')
    }
} 
