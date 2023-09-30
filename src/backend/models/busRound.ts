import { IBusRound } from "@/interface/bus";
import { Schema, model, models } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const schema = new Schema<IBusRound>(
  {
    event: {
      type: ObjectId,
      ref: 'Event'
    },
    recordedBy: {
      type: ObjectId,
      ref: "BusAccount",
      autopopulate: { select: ['name'], maxDepth: 1 }
    },
    vehicle: {
      type: ObjectId,
      ref: 'Vehicle'
    },
    busZone: {
      type: ObjectId,
      ref: 'BusGroup',
      autopopulate: { select: ['name'], maxDepth: 1 }
    },
    busState: {
      type: String,
      enum: ['EN_ROUTE', 'ARRIVED',]
    },
    people: {
      type: Number,
      default: 0
    },
    busCost: {
      type: Number,
      default: 0
    },
    busOffering: {
      type: Number,
      default: 0
    },
    lastCheckPoint: {
      type: String,
      default: 0
    },
    stopPoints: [{
      _id: 0,
      location: {
        type: String,
      },
      people: {
        type: Number
      }
    }],
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
      wtimeout: 1000
    }
  })

schema.plugin(require('mongoose-autopopulate'))
const BusRound = models.BusRound || model<IBusRound>('BusRound', schema);
export default BusRound;
