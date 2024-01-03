import { Types } from 'mongoose';

export interface INewsletter {
    _id?: string
    name: string
    email: string
    host: string
    website: string
}
