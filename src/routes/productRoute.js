import productController from "../controllers/productController.js";
import express from "express"

const route = express.Router()

route.post("/add_category", productController.category)
route.put("/update_cat", productController.updateCategory)
route.get("/category_list/:store_id", productController.getCategory)
route.delete("/del_cat", productController.delCategory)

route.post("/prod", productController.product)
route.put("/update_prod", productController.updateProduct)
route.get("/prod_list/:store_id", productController.getProduct)
route.delete("/del_prod", productController.deleteProduct)

export default route