import { Schema, model, models, Types } from "mongoose";
import { MeetingTypes } from "@/helpers/misc";
import { IEvent } from "@/interface/events";

const Mixed = Schema.Types.Mixed

const schema = new Schema<IEvent>({
    name: {
        type: String,
    },
    duration: {
        start: {
            type: Date
        },
        end: {
            type: Date
        }
    },
    speaker: {
        type: [String]
    },
    venue: {
        type: String
    },
    meetingType: {
        type: String,
        enum: [...MeetingTypes],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE']
    }
}, {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    },
})


const Event = model<IEvent>('Attendee', schema);

export default Event;