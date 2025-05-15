import mongoose from "mongoose"
import db from "../../db/db.js";

const organizationSchema = new mongoose.Schema({
  common_org_id: { type: String, required: true },
  app_id: { type: String, required: true },
  plan_id: { type: String, required: true },
  plan_name: { type: String },
  payment_status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  duration_in_months: { type: String },
  price: { type: Number },
  features: { type: String, required: true },
  max_users: { type: String },
  is_active: { type: Boolean, default: true },
  plan_start_date: { type: Date },
  plan_end_date: { type: Date },
  status: { type: String, default: 'active' },
  created_by:{type: String, required: true},
  created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

organizationSchema.virtual("org_id").get(function () {
  return this._id.toString();
});


const orgModel =() => db.getDb2().model('organization', organizationSchema);

export default orgModel