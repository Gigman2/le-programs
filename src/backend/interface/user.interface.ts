import { Types } from "mongoose";

export interface IUser {
    _id: string
    firstName: string;
    otherNames: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    newUser: Boolean;
    gender: 'MALE' | 'FEMALE'
    dob?: Date;
    location: {
        name: string;
        country: string;
        geoPoint: string;
        address: string
    }[]
    churchBranch: string;
    roles: string[] | { _id: Types.ObjectId, name: string }[];
    activeRole?: string
    avatar: string;
    password?: string;
    accountCreated: boolean
    status: 'ACTIVE' | 'INACTIVE'
    comparePassword?: (p: string) => boolean
    generateAuthToken?: () => { user: IUser, accessToken: string, refreshToken: string }
    hasRole?: (roleId: string) => boolean
    assignRole?: (roleId: string) => void
}

export interface IRelative {
    relation: 'sibling' | 'father' | 'mother' | 'wife' | 'husband',
    user: IUser
    relative: IUser
}