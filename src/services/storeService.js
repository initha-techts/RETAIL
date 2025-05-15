import retailOrgModel from "../models/retailModel/retailOrg.js";
import storeModel from "../models/retailModel/storeModel.js";

const storeService ={

  addStore: async(data)=>{
    const { retailOrg_id, user_id, store_name,phoneNumber,email,address,city,state, pincode, country,pan_no, gstin, tax_method, currency} = data
    try {
      const retailOrg = await retailOrgModel().findById(retailOrg_id)
      if(!retailOrg){
        throw {status: 400, message:"organization not found"}
      }

      if (user_id !== retailOrg.created_by) {
        throw { status: 403, message: "User is not authorized to add products to this organization." };
      }

      const store = await storeModel().create({
        retailOrg_id, 
        created_by: user_id, 
        store_name,
        phoneNumber,
        email,
        address,
        city,
        state, 
        pincode, 
        country,
        pan_no, 
        gstin, 
        tax_method, 
        currency})

      console.log(store)
      return store

    } catch (error) {
      console.error("Error in adding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
            }
    }
  },

  updateStore: async(data)=>{
    const { store_id, retailOrg_id, user_id, store_name,phoneNumber,email,address,city,state, pincode, country,pan_no, gstin, tax_method, currency } = data
    try {
      const retailOrg = await retailOrgModel().findById(retailOrg_id)
      if(!retailOrg){
        throw {status: 400, message:"organization not found"}
      }
      if (user_id !== retailOrg.created_by) {
        throw { status: 403, message: "User is not authorized to add products to this organization." };
      }

      const updateStore = await storeModel().findByIdAndUpdate(store_id,{ store_name,phoneNumber,email,address,city,
        state, pincode, country,pan_no, gstin, tax_method, currency },{new: true})

      console.log(updateStore)
      return updateStore
    } catch (error) {
      console.error("Error in adding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
            }
    }
  },

    addUpdateStore: async(data) =>{
        const { 
          store_id, retailOrg_id, user_id, store_name,phoneNumber,email,address,city,state, pincode, country,pan_no, gstin, tax_method, currency } = data;
          try {
            const retailOrg = await retailOrgModel().findById(retailOrg_id)
            if(!retailOrg){
              throw {status: 400, message:"organization not found"}
            }
            if (user_id !== retailOrg.created_by) {
              throw { status: 403, message: "User is not authorized to add products to this organization." };
            }
      
            const storeData = { 
              store_name,phoneNumber,email,address,city,state, pincode, country,pan_no, gstin, tax_method, currency }
    
            if(store_id){
              const existStore = await storeModel().findById(store_id)
              if(existStore){
                const updateStore = await storeModel().findByIdAndUpdate(store_id, storeData, { new: true, runValidators: true })
                console.log(updateStore)
                return updateStore
              }else{
                throw{status:400, message:"store not found"}
              }
            }else{
              const newStore = await storeModel().create({ retailOrg_id, created_by:user_id, store_name,phoneNumber,email,address,city,state, 
                pincode, country,pan_no, gstin, tax_method, currency})
              console.log(newStore)
              return newStore
            }
          } catch (error) {
            console.error("Error in adding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
            }
          }
      },


      getStore: async (data) => {
        const { retailOrg_id } = data;
      
        try {
          if (!retailOrg_id) {
            throw { status: 400, message: "retailOrg_id is required" };
          }
      
          const store = await storeModel().find({ retailOrg_id: retailOrg_id });
      
          if (!store || store.length === 0) {
            return { message: "No stores found for this organization", stores: [] };
          }
      
          return store;
        } catch (error) {
          console.error("Error in getStore:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },
      
}

export default storeService