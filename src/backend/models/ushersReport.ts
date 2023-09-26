import { IUshersReport } from "@/interface/ushers";
import { Schema, Types, model, models } from "mongoose";
const Mixed = Schema.Types.Mixed

const schema = new Schema<IUshersReport>({
  reportBy: {
    type: String,
  },
  eventId: {
    type: Types.ObjectId,
  },
  finalHeadcount: {
    type: Number
  },
  comments: {
    type: String
  },
  extraFields: [{
    type: Mixed
  }],
  countBreakdown: {
    type: Mixed
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


const UshersReport = models.ushersReport || model<IUshersReport>('ushersReport', schema);

export default UshersReport;
