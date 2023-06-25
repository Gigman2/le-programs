import { IBusGroups } from "@/interface/bus";
import { Schema, model } from "mongoose";

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
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    },
})


const BusGroup = model<IBusGroups>('BusGroup', schema);

export default BusGroup;