import storeService from "../services/storeService.js";

const storeController = {

    addStore: async(req, res, next)=>{
        try {
            const Stores = await storeService.addStore(req.body)
            return res.status(200).json({message:"store created success", Stores})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    updateStore: async(req, res, next)=>{
        try {
            const updatedStore = await storeService.updateStore(req.body)
            return res.status(200).json({message:"store updated success", updatedStore})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    addUpdateStore: async(req, res, next)=>{
        try {
            const Store = await storeService.addUpdateStore(req.body)
            return res.status(200).json({message:"store created success", Store})
            
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    getStore: async(req, res, next)=>{
        try {
            const adminStores = await storeService.getStore(req.params)
            return res.status(200).json({message:"all admin stores!", adminStores})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    }

}

export default storeController