import { IBusGroups } from "@/interface/bus";
import { Schema, model, models } from "mongoose";

const schema = new Schema<IBusGroups>({
    busReps: {
        type: [String],
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    stations: {
        type: [String],
        required: true
    },
    totalBuses: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED']
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


const BusGroup = models.BusGroup || model<IBusGroups>('BusGroup', schema);

export default BusGroup;