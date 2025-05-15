import customerModel from "../models/retailModel/customerModel.js";
import retailOrgModel from "../models/retailModel/retailOrg.js";
import storeModel from "../models/retailModel/storeModel.js";
import userModel from "../models/retailModel/usersModel.js";

const cusService = {

    addCustomer: async(data)=>{
        const { retailOrg_id, store_id, user_id, customer_name, phoneNo} = data
        try {
            const org = await retailOrgModel().findById(retailOrg_id);
          if (!org) {
            throw { status: 400, message: "Retail organization not found." };
          }
          const user = await userModel().findOne({ _id: user_id, retailOrg_id });
          if (!user) {
             throw { status: 400, message: "User not found." };
          }
          const store = await storeModel().findById(store_id);
          if (!store) {
            throw { status: 400, message: "Store not found." };
          }

        const existingCustomer = await customerModel().findOne({phoneNo})
        if(existingCustomer){
            throw { status: 400, message:"Customer with this phone number already exists."}
        }

          const customer = await customerModel().create({
            retailOrg_id,
            store_id,
            created_by: user_id,
            customer_name, 
            phoneNo
          })

          console.log(customer)
          return customer

        } catch (error) {
            console.error("Error in add customer:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          }
        }
    }
}

export default cusService