import { Schema, model, models } from "mongoose";
const Mixed = Schema.Types.Mixed

const ModelSchema = new Schema({

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


const HeadCount = models.headCount || model('headCount', ModelSchema);

export default HeadCount;