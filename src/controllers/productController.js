import productService from "../services/productService.js";

const productController = {
 
    category: async(req, res, next) =>{
        try {
            const newCategory = await productService.category(req.body)
            return res.status(200).json({ message:"category added successfully", newCategory})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    updateCategory: async(req, res, next) =>{
        try {
            const updateCat = await productService.updateCategory(req.body)
            return res.status(200).json({ message:"category updated", updateCat})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    getCategory: async( req, res, next) =>{
        try {
            const categories = await productService.getCategory(req.params)
            return res.status(200).json({ message:" all category", count:categories.length, categories})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    delCategory: async( req, res, next) =>{
        try {
            const deleteCat = await productService.delCategory(req.body)
            return res.status(200).json({message:"category deleted", deleteCat})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error);
        }
    },


    product: async(req, res, next) =>{
        try {
           const newProduct = await productService.product(req.body)
           return res.status(200).json({ message:"product add success", newProduct})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    updateProduct: async(req, res, next) =>{
        try {
            const updatedProd = await productService.updateProduct(req.body)
            return res.status(200).json({ message:"updated success", updatedProd})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    getProduct: async( req, res, next ) =>{
        try {
            const allProduct = await productService.getProduct(req.params)
            return res.status(200).json({message:"product list", allProduct})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    deleteProduct: async( req, res, next) =>{
        try {
            const deletedProd = await productService.deleteProduct(req.body)
            return res.status(200).json({message:"product deleted", deletedProd})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    }
}

export default productController