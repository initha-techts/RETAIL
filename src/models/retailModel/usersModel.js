
import mongoose from "mongoose";
import db from "../../db/db.js";


const userSchema = new mongoose.Schema({

    retailOrg_id: { type: String, required: false },
    store_id: { type: String, required: false },
    role_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'role' },
    email: { type: String, required: true },
    password: { type: String, required: false },
    created_at: { type: Date, default: Date.now }
  }, { strict: false, versionKey: false });

  userSchema.virtual("user_id").get(function () {
  return this._id.toString();
});

const userModel = () => db.getDb1().model('user', userSchema);
export default userModel;
