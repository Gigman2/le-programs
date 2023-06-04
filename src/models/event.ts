import { Schema, model, models, Types } from "mongoose";
import { MeetingTypes } from "@/helpers/misc";

const Mixed = Schema.Types.Mixed

const EventSchema = new Schema({
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
        enum: [...MeetingTypes],
    }
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, },)


const Event = models.Event || model('Attendee', EventSchema);

export default Event;