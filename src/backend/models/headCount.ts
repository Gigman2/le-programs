import { IHeadcount } from "@/interface/ushers";
import { Schema, model } from "mongoose";
const Mixed = Schema.Types.Mixed

const schema = new Schema<IHeadcount>({

  recorder: {
    type: String,
  },
  total: {
    type: String,
  },
  section: {
    type: Mixed,
  }
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, },)


const HeadCount = model<IHeadcount>('headCount', schema);

export default HeadCount;