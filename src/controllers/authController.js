import authService from "../services/authService.js";

const authController = {
  
    Login: async(req, res, next)=>{
        try {
            const login = await authService.Login(req.body)
            return res.status(200).json({message:"login success", login})
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
    },

    sendOTP: async (req, res, next) => {
        try {
          const response = await authService.sendOTP(req.body);
          return res.status(200).json(response);
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
      },
    
      verifyOTP: async (req, res, next) => {
        try {
          const response = await authService.verifyOTP(req.body)
          res.status(200).json({ message: response.message });
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
      },
    
      resetPassword: async (req, res, next) => {
        try {
          const response = await authService.resetPassword(req.body);
        //   if (!response.success) {
        //     return res.status(400).json({ message:"reset password success" });
        //   }
    
          res.status(200).json({  message:"reset password success", response });
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
      },
}

export default authController