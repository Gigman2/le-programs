import { IBusGroups } from "@/interface/bus";
import { Schema, model, models } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const schema = new Schema<IBusGroups>(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['ZONE', 'BRANCH', 'SECTOR'],
            default: "ZONE",
            required: true
        },
        parent: {
            type: ObjectId,
            default: null,
        },
        station: {
            type: [String],
            required: true
        },
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


const BusGroup = models.BusGroup || model<IBusGroups>('BusGroup', schema);

export default BusGroup;
