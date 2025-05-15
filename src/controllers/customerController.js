import cusService from "../services/customerService.js";

const cusController = {

    addCustomer: async(req, res, next) =>{
        try {
            const newCustomer = await cusService.addCustomer(req.body)
            return res.status(200).json({message:"customer added", newCustomer})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    }
}

export default cusController