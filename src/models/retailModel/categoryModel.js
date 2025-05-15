
import mongoose from "mongoose";
import db from "../../db/db.js";


const categorySchema = new mongoose.Schema({
    retailOrg_id: { type: String, required: true },
    created_by:  { type: String, required: true },
    store_id: { type: String, required: true },
    category_name: { type: String, required: true },
    gst: { type: Number, required: true },
    description: { type: String },
    active: { type: Boolean },
  created_at: { type: Date, default: Date.now }
},{ strict: false, versionKey: false });

categorySchema.virtual("category_id").get(function () {
  return this._id.toString();
});

const CategoryModel = () => db.getDb1().model('category', categorySchema);
export default CategoryModel;



