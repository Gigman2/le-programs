export const saveBusUser = (data: Record<string, string | undefined | string[]>) => {
    if (typeof window !== undefined) {
        localStorage.setItem('le_auth', JSON.stringify(data))
    }
}

export const saveUser = (name?: string, group?: string, isRep?: boolean, groupName?: string, groupStations?: string[]) => {
    if (typeof window !== undefined) {
        localStorage.setItem('le_auth', JSON.stringify({ name, group, isRep, groupName, groupStations }))
    }
}

export const getUser = () => {
    if (typeof window !== undefined) {
        const user = localStorage.getItem('le_auth')
        return JSON.parse(user as string)
    }
}

export const addBus = (id: string) => {
    if (typeof window !== undefined) {
        const user = localStorage.getItem('le_auth')
        const parsedUser = JSON.parse(user as string)
        localStorage.setItem('le_auth', JSON.stringify({ ...parsedUser, bus: id }))
    }
}

export const clearUser = () => {
    if (typeof window !== undefined) localStorage.clear()
}


