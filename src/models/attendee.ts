import { Schema, model, models, Types } from "mongoose";
const Mixed = Schema.Types.Mixed

const AttendeeSchema = new Schema({
    details: {
        type: Mixed,
    },
    group: {
        type: String
    },
    addedBy: {
        type: String
    }
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, },)


const Attendee = models.Attendee || model('Attendee', AttendeeSchema);

export default Attendee;