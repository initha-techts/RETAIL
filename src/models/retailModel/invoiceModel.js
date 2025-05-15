import mongoose from "mongoose";
import db from "../../db/db.js";

const invoiceSchema = new mongoose.Schema({

  invoice_number: { type: String, required: true, unique: true },
  retailOrg_id: { type: String, required: true },
  store_id: { type: String, required: true },
  created_by: { type: String, required: true },
  customer_id:{ type: String, ref:"customer"},
//customer_name: { type: String, required: false },
//phoneNo: { type: String, required: false },

  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
      gst_rate: { type: Number, default: 0 },
      gst_amount: { type: Number, required: true }
    }
  ],

  total_amount: { type: Number, required: true },
  discount_total: { type: Number, required: true },
  gst_total: { type: Number, required: true },
  final_amount: { type: Number, required: true },

  created_at: { type: Date, default: Date.now }
},{ strict: false, versionKey: false })

invoiceSchema.virtual("invoice_id").get(function(){
    return this._id.toString();
})

const invoiceModel = () => db.getDb1().model('invoice', invoiceSchema)
export default invoiceModel