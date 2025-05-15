import mongoose from "mongoose";
import db from "../../db/db.js";


const appSchema = new mongoose.Schema({
    category_id:{ type:String, required:true},
    app_name:{ type:String, required:true},
    app_logo:{ type:String, required:false},
    created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

appSchema.virtual("app_id").get(function () {
  return this._id.toString();
});


const appModel =() => db.getDb2().model('app', appSchema);
export default appModel;

