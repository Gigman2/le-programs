import { Types } from 'mongoose';
import { IDocument } from './misc';

export interface IEvent extends IDocument {
    name: string
    duration?: {
        start: Date
        end: Date
    };
    meetingDays?: number[]
    speaker: string[]
    venue: string
    scope: {
        id: Types.ObjectId | null,
        type: "BRANCH" | "SECTOR" | "CHURCH"
    }
    occurrence: "FIXED" | "RECURRING"
    meetingType: 'TTHLA' | 'Mega Gathering' | 'CAMP' | 'Special Meeting' | 'Shepherd Meeting' | 'Prayer Meeting' | 'Zonal Meeting';
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}
