import { GroupedUnits } from "@/frontend/components/Accounts/busingLogin";
import redirect from "next/navigation";
export interface IAccountUser {
    name: string;
    accountId: string;
    bus: GroupedUnits
    roles: any[];
    currentRole?: { groupType: string, groupId: string }
    currentApp: "BUSING" | "USHERING"
}

export const saveBusUser = (data: IAccountUser) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('le_auth', JSON.stringify(data))
    }
}

export const saveUserToken = (token: string) => {
    if (typeof window !== "undefined") {
        console.log('Token is ', token)
        localStorage.setItem('auth_token', token)
    }
}

export const setRefreshToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('refresh_token', token)
    }
}

export const setTokenExpiry = (expiry: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('token_expiry', expiry)
    }
}

export const saveUser = (name?: string, group?: string, isRep?: boolean, groupName?: string, groupStations?: string[]) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('le_auth', JSON.stringify({ name, group, isRep, groupName, groupStations }))
    }
}

export const getUser = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem('le_auth')
        return JSON.parse(user as string) as IAccountUser
    }
}

export const removeSession = () => {
    if (typeof window !== "undefined" || typeof window !== undefined) {
        localStorage.clear()
        location.href = '/bus/login'
    }
}


export const addBus = (id: string) => {
    if (typeof window !== "undefined" || typeof window !== undefined) {
        const user = localStorage.getItem('le_auth')
        const parsedUser = JSON.parse(user as string)
        localStorage.setItem('le_auth', JSON.stringify({ ...parsedUser, bus: id }))
    }
}

export const clearUser = () => {
    if (typeof window !== "undefined" || typeof window !== undefined) localStorage.clear()
}

export const busForm = async (url: string, reqBody: any) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();



    return results
}


