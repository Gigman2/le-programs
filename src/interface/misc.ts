export interface IDocument {
    _id?: string
    created_on?: Date;
    updated_on?: Date;
}

export interface IResponse<T> {
    message: string;
    statusCode: number;
    data: T
}

export interface IUser {
    _id?: string;
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
    accountCreated: boolean
    churchBranch: string;
    roles: ('Non-Member' | 'Brethren' | 'Shepherd' | 'Chief-Shepherd' | 'Senior-Shepherd' | string)[];
    permissions: string[];
    avatar: string;
    password: string;
    status: 'ACTIVE' | 'INACTIVE'
}