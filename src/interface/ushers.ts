import { ObjectId } from "mongoose";

export interface IHeadCount {
    _id?: string
    recorder: string;
    total: string;
    section: Record<string, number>
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    created_on: string;
    updated_on: string;
}

export interface IUshersReport {
    _id?: string
    reportBy: string;
    eventId: ObjectId;
    finalHeadcount: number;
    comments: string;
    extraFields: string[];
    countBreakdown: { [key: string]: string };
    created_on: string;
    updated_on: string;
}