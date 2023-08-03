import { IHeadCount } from "@/interface/ushers";
import { Schema, model } from "mongoose";
const Mixed = Schema.Types.Mixed

const schema = new Schema<IHeadCount>({

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


export default model<IHeadCount>('HeadCount', schema);

