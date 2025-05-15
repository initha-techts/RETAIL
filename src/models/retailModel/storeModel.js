
import mongoose from "mongoose";
import db from "../../db/db.js";


const storeSchema = new mongoose.Schema({
    org_id: { type: String, required: false },
    created_by: { type: String, required: false },
    store_name: { type: String, required: false },
    phoneNumber:{type: Number, required: false },
    email:{type: String, required: false },
    address:{type: String, required: false},
    city:{type: String, required: false},
    state:{type: String, required: false},
    pincode:{type: Number, required: false},
    country:{type: String, required: false},
    pan_no:{type: String, required: false},
    gstin:{type: String, required: false},
    tax_method:{type: String, required: false},
    currency:{type: String, required: false},
    created_at: { type: Date, default: Date.now }
  }, { strict: false, versionKey: false });

  storeSchema.virtual("store_id").get(function () {
  return this._id.toString();
});

const storeModel = () => db.getDb1().model('store', storeSchema);
export default storeModel;
