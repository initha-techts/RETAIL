
import mongoose from "mongoose";
import db from "../../db/db.js";

const customerSchema = new mongoose.Schema({
  retailOrg_id: { type: String, required: true },
  store_id: { type: String, required: true },
  created_by: { type: String, required: true },
  customer_name: { type: String, required: true },
  phoneNo: { type: String, required: true ,validate: {
    validator: function (v) {
      return /^[6-9]\d{9}$/.test(v);  
    },
    message: props => `${props.value} is not a valid 10-digit phone number!`
  }
},
  invoice_id: { type: String }, // optional for now
  created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

customerSchema.virtual("customer_id").get(function () {
  return this._id.toString();
});

const customerModel = () => db.getDb1().model('customer', customerSchema);
export default customerModel;
