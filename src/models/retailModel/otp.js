import mongoose from "mongoose";
import db from "../../db/db.js"

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  },{ versionKey: false });

const otpModel = () => db.getDb1().model('otp', otpSchema);
export default otpModel;

