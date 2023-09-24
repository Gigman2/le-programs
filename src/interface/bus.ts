import { Types } from 'mongoose';
import { IDocument } from './misc';

export interface IBusRound extends IDocument {
    event: string | Types.ObjectId;
    recordedBy: string | Types.ObjectId;
    busZone: string | Types.ObjectId
    busState: 'EN_ROUTE' | 'ARRIVED';
    people: number;
    busOffering: number;
    busCost: number;
    stopPoints: string[];
    arrivalTime: string;
}

export interface IBusGroups extends IDocument {
    name: string,
    type: 'ZONE' | 'BRANCH' | 'SECTOR'
    parent: string | Types.ObjectId,
    station: string[],
}

export interface IBusAccount extends IDocument {
    name: string,
    accountType: ('BUS_REP' | 'BRANCH_HEAD' | 'SECTOR_HEAD' | 'OVERALL_HEAD')[]
    group: string
}
