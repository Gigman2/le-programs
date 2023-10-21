export interface IAccountUser {
    name: string;
    currentApp: "USHERING"
}

export const saveUser = (name?: string, currentApp?: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('le_auth', JSON.stringify({ name, currentApp }))
    }
}

export const getUser = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem('le_temp_auth')
        return JSON.parse(user as string) as IAccountUser
    }
}