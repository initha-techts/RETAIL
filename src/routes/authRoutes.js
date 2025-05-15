import express from "express"

import authController from "../controllers/authController.js"

const route = express.Router()

route.post("/login", authController.Login)

route.post("/send_otp", authController.sendOTP);
route.post("/verify_otp", authController.verifyOTP);
route.post("/reset_password", authController.resetPassword);

export default route