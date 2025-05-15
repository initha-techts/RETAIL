import planService from "../services/planSevice.js";

const planController ={

    createCategory:async(req, res, next)=>{
        try {
            const category = await planService.createCategory(req.body)
            return res.status(200).json({message:"category created!!", category})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },


    createApp: async(req, res, next)=>{
        try {
            const app = await planService.createApp(req.body)
            return res.status(200).json({message:"app created!!", app})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    menuItems: async(req, res, next)=>{
        try {
            const menu = await planService.menuItems(req.body)
            return res.status(200).json({message:"menu created!!", menu})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    plan:async(req, res, next)=>{
        try {
            const Plan = await planService.plan(req.body)
            return res.status(200).json({message:"plan created!!", Plan})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },
    registration: async (req, res, next) => {
        try {
          const result = await planService.registration(req.body);
      
          res.status(201).json({
            message: 'Organization and RetailOrg created successfully with RetailOrg ID as common_org_id',
            ...result
          });
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },
    // createPlan: async(req, res, next)=>{
    //     try {

    //         const plan = await planService.createPlan(req.body)
    //         return res.status(200).json({message:"create plan success!!", plan})
            
    //     } catch (error) {
    //         error.message = error.error;
    //         console.log(error);
    //         error.statuscode = 500;
    //         next(error);
    //     }
    // }
}

export default planController