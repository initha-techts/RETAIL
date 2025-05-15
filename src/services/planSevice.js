import bcrypt from "bcrypt"
import moment from "moment";

import planAccessModel from "../models/masterModel/planMaster.js";
import userModel from "../models/retailModel/usersModel.js";
import appModel from "../models/masterModel/appAccess.js";
import mainCategoryModel from "../models/masterModel/category.js";
import menuModel from "../models/masterModel/menuAccess.js";
import planModel from "../models/masterModel/planMaster.js";
import retailOrgModel from "../models/retailModel/retailOrg.js";
import orgModel from "../models/masterModel/organization.js";
import roleModel from "../models/retailModel/roleModel.js";

const planService = {

    createCategory : async(data)=>{
        const { category_name } = data
        try { 
            const check = await mainCategoryModel().findOne({category_name})
            if(check){
                throw { status:400, message:"category name already exist"}
            }
            const category = await mainCategoryModel().create({category_name})
            console.log(category)
            return category
        } catch (error) {
            console.error("Error in createPlan:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Internal Server Error",
            };
        }
    },

    createApp : async(data)=>{
        const { category_id, app_name, app_logo } = data
        try { 
            const categry = await mainCategoryModel().findById(category_id)
            if(!categry){
                throw{status:400, message:"category not found"}
            }
            const check = await appModel().findOne({category_id, app_name, app_logo})
            if(check){
                throw { status:400, message:"app name already exist"}
            }
            const App = await appModel().create({category_id, app_name, app_logo})
            console.log(App)
            return App
        } catch (error) {
            console.error("Error in create App:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Internal Server Error",
            };
        }
    },

    menuItems: async(data)=>{
        const { category_id, menuItem } = data
        try {
            const menu = await menuModel().create({ category_id, menuItem})
            console.log(menu)
            return menu
        } catch (error) {
            console.error("Error in add menuItem:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Internal Server Error",
            };
        }
    },

    plan: async (data) => {
        const {  plan_name, duration_in_months, price, features, max_users, is_active} = data;
        try {
            const Plan = await planAccessModel().create({
                plan_name, duration_in_months, price, features, max_users, is_active});
            return Plan;
        } catch (error) {
            console.error("Error in creating plan:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Internal Server Error",
            };
        }
    },

        registration: async (data) => {
            const { app_id, plan_id, email, password } = data;
            try {
                const app = await appModel().findById(app_id);
                if (!app) {
                  throw { status: 400, message: 'App not found' };
                }
            
                const plan = await planModel().findById(plan_id);
                if (!plan) {
                  throw { status: 400, message: 'Plan not found' };
                }
            
                const existingEmail = await userModel().findOne({ email });
                if (existingEmail) {
                  throw { status: 400, message: 'Email already exists' };
                }
                
            
                const plan_start_date = new Date();
                const plan_end_date = moment(plan_start_date).add(Number(plan.duration_in_months), 'months').toDate();
            
                const organization = await orgModel().create({
                  common_org_id: 'TEMP',
                  app_id,
                  plan_id,
                  plan_name: plan.plan_name,
                  payment_status: 'paid',
                  duration_in_months: plan.duration_in_months,
                  price: plan.price,
                  features: plan.features,
                  max_users: plan.max_users,
                  is_active: true,
                  plan_start_date,
                  plan_end_date,
                  status: 'active',
                  created_by:"temp",
                  created_at: new Date()
                });
            
                const retailOrg = await retailOrgModel().create({
                  app_id,
                  plan_id,
                  org_id: organization._id.toString(),
                  plan_name: plan.plan_name,
                  payment_status: 'paid',
                  duration_in_months: plan.duration_in_months,
                  price: plan.price,
                  features: plan.features,
                  max_users: plan.max_users,
                  is_active: true,
                  plan_start_date,
                  plan_end_date,
                  status: 'active',
                  created_by:"temp",
                  created_at: new Date(),
                });
            
                const updatedOrg = await orgModel().findByIdAndUpdate(
                  organization._id,
                  { $set: { common_org_id: retailOrg._id.toString() } },
                  { new: true }
                );
            
                let role = await roleModel().findOne({ role_name: 'Admin' });
                if (!role) {
                  role = await roleModel().create({
                    role_name: 'Admin',
                    permission: ["Dashboard", "sales", "user", "report", "tax", "history", "tools", "settings"],
                  });
                }
            
                const hashedPassword = await bcrypt.hash(password, 10);
            
                const user = await userModel().create({
                  retailOrg_id: retailOrg._id.toString(),
                  role_id: role._id.toString(),
                  email,
                  password: hashedPassword,
                });

                const updateRetailOrg = await retailOrgModel().findByIdAndUpdate(
                  retailOrg._id,
                  { $set: { created_by: user._id.toString() } },
                  { new: true }
              );
      
              const finalUpdatedOrg = await orgModel().findByIdAndUpdate(
                  organization._id,
                  { $set: { created_by: user._id.toString() } },
                  { new: true }
              );

                console.log( updatedOrg, retailOrg, role, user )
            
                return { Org: finalUpdatedOrg, retailOrg : updateRetailOrg, role, user };
            
              } catch (error) {
                console.error("Error in creating organization (or) registration:", error);
                throw {
                  status: error.status || 500,
                  message: error.message || "Internal Server Error",
                };
              }
           
        },
};

export default planService;
