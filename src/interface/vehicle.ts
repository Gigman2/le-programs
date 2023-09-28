import { Types } from 'mongoose';

export interface IVehicle {
    name: string
    capacity: number
    createdBy: Types.ObjectId
    averagePrice: number
}
