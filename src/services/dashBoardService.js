import productModel from "../models/retailModel/productModel.js";

const dashboardService = {

    getLowStock: async(data)=>{
        const {store_id} = data
        console.log(data)
        try {
          const allItems = await productModel().find({ active: true, store_id });

          const lowStockItems = allItems
            .filter(item => item.total_stock <= item.min_stock && item.total_stock > 0)
            .map(item => ({
              name: item.prod_name,
              item_quantity: item.total_stock
            }));
      
          return {
            count: lowStockItems.length,
            items: lowStockItems
          };
        } catch (error) {
            console.error("Error in finding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
           }
        }
    },

    getOutOfStock: async (data)=>{
        const {store_id} = data
        console.log(data)
        try {
            const allItems = await productModel().find({ active: true, store_id });

            const outOfStockItems = allItems
              .map(item => {
                if (item.total_stock === 0) {
                  return {itmeName : item.prod_name};
                }
                return null;
              })
              .filter(item => item !== null);
          
            return outOfStockItems ;
        } catch (error) {
            console.error("Error in finding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
           }
        }

    },

}

export default dashboardService