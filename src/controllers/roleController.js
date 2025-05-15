import roleService from "../services/roleService.js";

const roleController ={
    roleAccess :async (req, res, next) =>{
        try {
            const RoleAccess = await roleService.roleAccess(req.body)
            console.log(RoleAccess)
            return res.status(200).json({message:"user role access", RoleAccess})
            
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    }
}

export default roleController