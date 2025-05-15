import CategoryModel from "../models/retailModel/categoryModel.js"
import productModel from "../models/retailModel/productModel.js"
import retailOrgModel from "../models/retailModel/retailOrg.js"
import storeModel from "../models/retailModel/storeModel.js"
import userModel from "../models/retailModel/usersModel.js"
// import roleModel from "../models/retailModel/roleModel.js"

const productService ={

   category: async (data) => {
  const { retailOrg_id, user_id, store_id, category_name, gst, description, active } = data;

  try {
    const org = await retailOrgModel().findById(retailOrg_id);
    if (!org) throw { status: 400, message: "Retail organization not found" };

    const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }

    // roleModel()
    // const user = await userModel().findById(user_id).populate("role_id");
    // if (!user || user.role_id.role_name !== "Admin") {
    //   throw { status: 403, message: "Only Admin can create categories. Access denied!" };
    // }

    const store = await storeModel().findById(store_id);
    if (!store) throw { status: 400, message: "Store not found" };

    const nameCheck = await CategoryModel().findOne({ category_name });
    if (nameCheck) throw { status: 400, message: "Category name already exists" };

    const category = await CategoryModel().create({
      retailOrg_id,
      created_by: user_id,
      store_id,
      category_name,
      gst,
      description,
      active,
    });

    console.log("Category Created:", category);
    return category;

  } catch (error) {
    console.error("Error in post category:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
},


    updateCategory: async(data)=>{
      const { retailOrg_id, user_id, store_id, category_id, category_name, gst, description, active} = data
      try {
        
        const org = await retailOrgModel().findById(retailOrg_id)
        if(!org){
          throw {status:400, message:"retail org not found"}
        }
        const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }

        // const user = await userModel().findById(user_id).populate('role_id')
        
        // if (user.role_id.role_name !== "Admin") {
        //   throw { status: 403, message: "Only Admin can delete products. Access denied!" };
        // }
        const store = await storeModel().findById(store_id)
        if(!store){
          throw { status:400, message:"store not found"}
        }

        const cat = await CategoryModel().findById(category_id)
        if(!cat){
          throw { status:400, message:"category not found"}
        }
        
        
        // if(user_id !== org.created_by){
        //   throw { status: 403, message:"user is not authorized to add products to this organization."}
        // }
        
        const category_update = await CategoryModel().findByIdAndUpdate(category_id, { category_name, gst, description, active}, {new:true})
        console.log(category_update)
        return category_update
      } catch (error) {
        console.error("Error in updating category:", error);
                throw {
                  status: error.status || 500,
                  message: error.message || "Internal Server Error",
                };
      }
    },

    getCategory: async(data)=>{
      const {store_id} = data
      try {


        
        if (!store_id) {
          throw { status: 400, message: "store_id is required" };
        }

        const store = await storeModel().findById(store_id)
        if(!store){
          throw { status:400, message:"store not found"}
        }

        const allCategory = await CategoryModel().find({store_id})
        console.log(allCategory)
        return allCategory
        
      } catch (error) {
        console.error("Error in updating category:", error);
        throw {
             status: error.status || 500,
             message: error.message || "Internal Server Error",
             };
      }
    },

    delCategory: async(data) =>{
      const { user_id, category_id, retailOrg_id, store_id } = data
      try {
        const org = await retailOrgModel().findById(retailOrg_id)
        if(!org){
          throw {status:400, message:"retail org not found"}
        }
        const store = await storeModel().findById(store_id)
        if(!store){
          throw { status:400, message:"store not found"}
        }

        const cat = await CategoryModel().findById(category_id)
        if(!cat){
          throw { status:400, message:"category not found"}
        }

        const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }

        // const user = await userModel().findById(user_id).populate('role_id')
        
        // if (user.role_id.role_name !== "Admin") {
        //   throw { status: 403, message: "Only Admin can delete products. Access denied!" };
        // }

        // if(user_id !== org.created_by){
        //   throw { status: 403, message:"user is not authorized to add products to this organization."}
        // }
        const isUsed = await productModel().findOne({ category_id });
        if (isUsed) {
          throw { status: 400, message: "Cannot delete category; it's used in products." };
        }

        const delCat = await CategoryModel().findByIdAndDelete(category_id)
        console.log(delCat)
        return delCat
      } catch (error) {
        console.error("Error in updating category:", error);
        throw {
             status: error.status || 500,
             message: error.message || "Internal Server Error",
             };
      }
    },

  


    //=============================== product ====================================


    product: async (data) => {
        const {
          retailOrg_id, user_id, store_id, category_id, prod_name, product_image, bar_code,
          price, total_stock, uom, min_stock, purchase_price, sale_price, mrp, gst, discount, active
        } = data;
      
        try {

          const org = await retailOrgModel().findById(retailOrg_id);
          if (!org) {
            throw { status: 400, message: "Retail organization not found." };
          }
          const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }

          // roleModel();
          // const user = await userModel().findById(user_id).populate('role_id');
          // if (!user) {
          //     throw { status: 400, message: "User not found" };
          // }

          // if (user.role_id.role_name !== "Admin") {
          //   throw { status: 403, message: "Only Admin can add products. Access denied!" };
          // }
      
          const store = await storeModel().findById(store_id);
          if (!store) {
            throw { status: 400, message: "Store not found." };
          }
      
          const category = await CategoryModel().findById(category_id);
          if (!category) {
            throw { status: 400, message: "Category not found." };
          }
      
          // if (user_id !== org.created_by) {
          //   throw { status: 403, message: "User is not authorized to add products to this organization." };
          // }
 
          const existingProduct = await productModel().findOne({ prod_name, store_id });
          if (existingProduct) {
            throw { status: 409, message: "Product name already exists in this store." };
          }
      
          const product = await productModel().create({
            retailOrg_id,
            created_by: user_id,
            store_id,
            category_id,
            prod_name,
            product_image,
            bar_code,
            price,
            total_stock,
            uom,
            min_stock,
            purchase_price,
            sale_price,
            mrp,
            gst,
            discount,
            active
          });
      
          console.log("Product created:", product);
          return product;
        } catch (error) {
          console.error("Error in add product:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },


      updateProduct: async( data ) =>{
        const { prod_id, retailOrg_id, user_id, store_id, category_id, prod_name, product_image, bar_code,
          price, total_stock, uom, min_stock, purchase_price, sale_price, mrp, gst, discount, active } = data
        try {
          const org = await retailOrgModel().findById(retailOrg_id);
          if (!org) {
            throw { status: 400, message: "Retail organization not found." };
          }
      
          const store = await storeModel().findById(store_id);
          if (!store) {
            throw { status: 400, message: "Store not found." };
          }
      
          const category = await CategoryModel().findById(category_id);
          if (!category) {
            throw { status: 400, message: "Category not found." };
          }
          const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }
      
          // if (user_id !== org.created_by) {
          //   throw { status: 403, message: "User is not authorized to add products to this organization." };
          // }
 
          const  updateProd = await productModel().findByIdAndUpdate(prod_id, {prod_name, product_image, bar_code,
            price, total_stock, uom, min_stock, purchase_price, sale_price, mrp, gst,  discount, active },{new:true})

          console.log(updateProd)
          return updateProd
        } catch (error) {
          console.error("Error in add product:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },

      getProduct: async(data)=>{
        const {store_id } = data;
        try {
          if (!store_id) {
            throw { status: 400, message: "store_id is required" };
          }
          const Store = await storeModel().findById(store_id)
          if(!Store){
            throw { status: 400, message:"store not found"}
          }
          const products = await productModel().find({ store_id });
      
          return products;
        } catch (error) {
          console.error("Error in add product:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },

      deleteProduct: async(data) =>{
        const { retailOrg_id, user_id, store_id, prod_id} = data
        try {
          const org = await retailOrgModel().findById(retailOrg_id)
        if(!org){
          throw {status:400, message:"retail org not found"}
        }
        const store = await storeModel().findById(store_id)
        if(!store){
          throw { status:400, message:"store not found"}
        }

        const prod = await productModel().findById( prod_id)
        if(!prod){
          throw { status:400, message:"product not found"}
        }
        const user = await userModel().findById(user_id)
        if(!user){
          throw { status: 400, message:"user not found"}
        }
        // const user = await userModel().findById(user_id).populate('role_id');
        // if (!user) {
        //     throw { status: 400, message: "User not found" };
        // }

        // if (user.role_id.role_name !== "Admin") {
        //   throw { status: 403, message: "Only Admin can delete products. Access denied!" };
        // }
        // if(user_id !== org.created_by){
        //   throw { status: 403, message:"user is not authorized to add products to this organization."}
        // }

        const delProd = await productModel().findByIdAndDelete(prod_id)
        console.log(delProd)
        return delProd
        } catch (error) {
          console.error("Error in add product:", error);
          throw {

            
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },

}

export default productService