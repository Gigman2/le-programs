import { IBusAccount, IBusRound } from "@/interface/bus";
import { Schema, model, models } from "mongoose";

const schema = new Schema<IBusAccount>(
  {
    name: {
      type: String,
    },
    accountType: [{
      groupType: {
        type: String,
        enum: ["BUS_REP", "BRANCH_HEAD", "SECTOR_HEAD", "OVERALL_HEAD"]
      },
      groupId: {
        type: String
      }
    }],
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

const BusAccount = models.BusAccount || model<IBusAccount>('BusAccount', schema);
export default BusAccount;
