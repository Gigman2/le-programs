import { Types } from 'mongoose';

export interface IVehicle {
    _id?: string
    name: string
    capacity: number
    createdBy: Types.ObjectId
    averagePrice: number
}
