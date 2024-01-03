import { Schema, model, models } from "mongoose";
import { IVehicle } from "@/interface/vehicle";
import { INewsletter } from "@/interface/newsletter";

const ObjectId = Schema.Types.ObjectId

const schema = new Schema<INewsletter>(

    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        website: {
            type: String,
            required: true
        },
        host: {
            type: String,
            required: true
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


const Newsletter = models.Newsletter || model<INewsletter>('Newsletter', schema);
export default Newsletter;