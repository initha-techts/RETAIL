import mongoose from "mongoose";
import db from "../../db/db.js";


const categorySchema = new mongoose.Schema({
    category_name:{ type:String, required:true},
    created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

categorySchema.virtual("category_id").get(function () {
  return this._id.toString();
});


const mainCategoryModel =() => db.getDb2().model('category', categorySchema);
export default mainCategoryModel;

