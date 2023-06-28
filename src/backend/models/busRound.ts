import { IBusRound } from "@/interface/bus";
import { Schema, model, models, Types } from "mongoose";

const schema = new Schema<IBusRound>(
    {
        event: {
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
        arrivalTime: {
            type: String
        }
    },
    {

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


const BusRound = models.BusRound || model<IBusRound>('BusRound', schema);

export default BusRound;