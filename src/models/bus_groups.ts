import { Schema, model, models } from "mongoose";

const BusGroupSchema = new Schema({
    busReps: {
        type: [String],
        required: true
    },
    busRound: {
        type: Boolean,
        default: true
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
    }
},)


const BusGroup = models.BusGroup || model('BusGroup', BusGroupSchema);

export default BusGroup;