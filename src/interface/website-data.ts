import { Types } from 'mongoose';

export interface INewsletter {
    _id?: string
    name: string
    email: string
    host: string
    website: string
}

export interface IMessage {
    _id?: string
    name: string
    message: string
    host: string
    website: string
}
