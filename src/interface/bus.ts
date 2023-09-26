import { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId
export interface IBusRound {
    _id: string
    busRep: string;
    busGroup: typeof ObjectId | string;
    event: typeof ObjectId | string;
    busState: 'EN_ROUTE' | 'ARRIVED';
    totalPeople: number;
    busFare: number;
    currentStation: string;
    totalFare: number
    arrivalTime: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    created_on: Date;
    updated_on: Date;
}


export interface IBusGroups {
    _id?: string
    busReps: string[],
    groupName: string
    stations: string[],
    totalBuses: number,
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    created_on: Date;
    updated_on: Date;
}
