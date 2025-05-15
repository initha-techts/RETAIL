// store.js
import mongoose from "mongoose";
import db from "../../db/db.js";

const planSchema = new mongoose.Schema({
  plan_name: { type: String, required: false },
  duration_in_months: {type: String, required: false},
  price: { type: Number },
  features:{ type: String, required: true }, 
  max_users: { type: Number, required: false },
  is_active: { type: String, required: false },
  created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

planSchema.virtual("plan_id").get(function () {
  return this._id.toString();
});


const planModel =() => db.getDb2().model('plan', planSchema);
export default planModel;

