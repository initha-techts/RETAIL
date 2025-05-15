import billService from "../services/billingService.js";

const billController = {

    invoice: async(req, res, next)=>{
        try {
            const invoice = await billService.invoice(req.body)
            return res.status(200).json({message:"customer added", invoice})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    }

}

export default billController