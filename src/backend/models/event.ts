import { Schema, model, models } from "mongoose";
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

    versionKey: false,
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    },
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000,
    },
})


const Event = models.Event || model<IEvent>('Event', schema);

export default Event;