import { IUshersReport } from "@/interface/ushers";
import { Schema, Types, model } from "mongoose";
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
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, },)


export default model<IUshersReport>('headCounts', schema);
