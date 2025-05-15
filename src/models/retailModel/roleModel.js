
import mongoose from "mongoose";
import db from "../../db/db.js";


const roleSchema = new mongoose.Schema({
    retailOrg_id: {type: mongoose.Schema.Types.ObjectId, ref: 'retailOrg' },
    role_name: { type: String, required: false },
    permission: { type: [String], required: false },

    created_at: { type: Date, default: Date.now }
  }, { strict: false, versionKey: false });

  roleSchema.virtual("role_id").get(function () {
  return this._id.toString();
});

const roleModel = () => db.getDb1().model('role', roleSchema);
export default roleModel;
