import { Schema, model, models, Types } from "mongoose";

const BusRoundsSchema = new Schema({

    eventId: {
        type: Types.ObjectId,
        ref: 'Event'
    },
    busRep: {
        type: String,
    },
    busGroup: {
        type: Types.ObjectId,
        ref: 'BusGroup'
    },
    busState: {
        type: String,
        enum: ['EN_ROUTE', 'ARRIVED',]
    },
    totalPeople: {
        type: Number,
        default: 0
    },
    // actual busing cost
    totalFare: {
        type: Number,
        default: 0
    },
    // offering collected for bus fare
    busFare: {
        type: Number,
        default: 0
    },
    currentStation: {
        type: String,
        default: ''
    },
    members: [
        {
            type: Types.ObjectId,
            ref: 'Attendee'
        },
    ],
    arrivalTime: {
        type: String
    },
    nonBus: {
        type: Boolean,
    }
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, },)


const BusRound = models.BusRound || model('BusRound', BusRoundsSchema);

export default BusRound;