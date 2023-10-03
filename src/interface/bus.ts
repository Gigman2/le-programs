import { Types } from 'mongoose';
import { IDocument } from './misc';

export interface IBusRound extends IDocument {
    event: string | Types.ObjectId;
    recordedBy: string | Types.ObjectId;
    vehicle: string | Types.ObjectId;
    busZone: string | Types.ObjectId
    busState: 'EN_ROUTE' | 'ARRIVED';
    people: number;
    busOffering: number;
    busCost: number;
    stopPoints: { location: string, people: number }[];
    arrivalTime: string;
    lastCheckPoint?: string
    status?: string
}

export interface IBusGroups extends IDocument {
    name: string,
    type: 'ZONE' | 'BRANCH' | 'SECTOR'
    parent: string | Types.ObjectId,
    station: string[],
    status?: string
    accounts?: ((IBusAccount | string)[]) | null
    subGroup?: ((IBusGroups | string)[]) | null

}

export type AccountType = {
    groupType: ('BUS_REP' | 'BRANCH_HEAD' | 'SECTOR_HEAD' | 'OVERALL_HEAD')
    groupId: string
}
export interface IBusAccount extends IDocument {
    name: string,
    accountType?: AccountType[],
    addedGroup?: string
    status?: string
    email?: string
}
