import { Schema, model, models } from "mongoose";
import { MeetingTypes } from "@/helpers/misc";
import { IEvent } from "@/interface/events";

const ObjectId = Schema.Types.ObjectId

const schema = new Schema<IEvent>(
    {
        name: {
            type: String,
        },
        duration: {
            start: {
                type: Date,
            },
            end: {
                type: Date,
            },
        },
        meetingDays: [
            { type: Number }
        ],
        venue: {
            type: String,
        },
        meetingType: {
            type: String,
            enum: [...MeetingTypes.map(item => item.tag)],
        },
        scope: {
            id: { type: ObjectId },
            type: {
                type: String,
                enum: ["BRANCH", "SECTOR", "CHURCH"]
            }
        },
        occurrence: {
            type: String,
            enum: ['RECURRING', 'FIXED']
        },
        status: {
            type: String
        }
    }, {

    versionKey: false,
    timestamps: {
        createdAt: "created_on",
        updatedAt: "updated_on",
    },
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000,
    },
})


const Event = models.Event || model<IEvent>('Event', schema);
export default Event