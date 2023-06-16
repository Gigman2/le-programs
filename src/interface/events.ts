import { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId

export interface IEvent {
    _id?: string
    name: string
    duration: {
        start: Date
        end: Date
    };
    speaker: string[]
    venue: string
    meetingType: 'TTHLA' | 'Mega Gathering' | 'CAMP' | 'Special Meeting' | 'Shepherd Meeting' | 'Prayer Meeting' | 'Zonal Meeting';
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}
