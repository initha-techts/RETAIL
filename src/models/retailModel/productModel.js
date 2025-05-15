
import mongoose from "mongoose";
import db from "../../db/db.js";


const productSchema = new mongoose.Schema({   
    retailOrg_id: { type: String, required: true },
    created_by:  { type: String, required: true },
    store_id: { type: String, required: true },
    category_id: { type: String, required: true },
    prod_name: {type: String, required: true },
    product_image: { type: String, required: false},
    bar_code: { type: String, required: false},
    price: { type: Number },
    total_stock: {type: Number, required: false},
    uom: { type: String, required: false },
    min_stock: { type: Number, default: false },
    purchase_price: { type: Number, required: false },
    sale_price: { type: Number, required: false },
    mrp: { type: Number, required: false},
    gst: { type: Number, required: false},
    discount:{type: Number, required: false},
    active:{type: Boolean, required: false},
    created_at: { type: Date, default: Date.now }
},{ strict: false, versionKey: false });

productSchema.virtual("prod_id").get(function () {
  return this._id.toString();
});

const productModel = () => db.getDb1().model('product', productSchema);
export default productModel;



