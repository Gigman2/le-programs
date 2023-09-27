import { Schema, model, models } from "mongoose";
import { IVehicle } from "@/interface/vehicle";

const ObjectId = Schema.Types.ObjectId

const schema = new Schema<IVehicle>(

    {
        name: {
            type: String,
        },
        capacity: {
            type: Number
        },
        createdBy: {
            type: ObjectId
        },
        averagePrice: {
            type: Number
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


const Vehicle = models.Vehicle || model<IVehicle>('Vehicle', schema);
export default Vehicle;