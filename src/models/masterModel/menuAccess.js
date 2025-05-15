import mongoose from "mongoose";
import db from "../../db/db.js";


const menuSchema = new mongoose.Schema({
    category_id:{ type:String, required:true},
    menuItem:{ 
        dashBoared:{ type:Number, required:false},
        biiling:{type:Number, required:false},
        account:{type:Number, required:false},
        users:{type:Number, required:false}
    },
    created_at: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

menuSchema.virtual("menu_id").get(function () {
  return this._id.toString();
});


const menuModel =() => db.getDb2().model('menu', menuSchema);

export default menuModel

