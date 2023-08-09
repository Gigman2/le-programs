import { IHeadCount } from "@/interface/ushers";
import { Schema, model, models } from "mongoose";
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

const HeadCount = models.headCount || model<IHeadCount>('headCount', schema);

export default HeadCount;