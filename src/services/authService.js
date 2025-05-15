import otpModel from "../models/retailModel/otp.js";
import retailOrgModel from "../models/retailModel/retailOrg.js";
import roleModel from "../models/retailModel/roleModel.js";
import userModel from "../models/retailModel/usersModel.js";

import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

const authService ={

  Login: async (data) => {
    const { email, password } = data;
  
    try {
      const user = await userModel().findOne({ email });
      if (!user) {
        throw { status: 400, message: "User email not found" };


      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw { status: 404, message: "Invalid password" };
      }

      const Org = await retailOrgModel().findOne({ _id: user.retailOrg_id });
      if (!Org) {
        throw { status: 404, message: 'Retail organization is not found' };
      }
  
      const retailOrg = await retailOrgModel().findOne({ _id: user.retailOrg_id });
      if (!retailOrg || retailOrg.status !== 'active' || !retailOrg.is_active) {
        throw { status: 403, message: 'Retail organization is not active' };
      }
  
      console.log("Login successful");
  
      return {
        message: "Login successful!!",
        role_id: user.role_id,
        retailOrg_id: user.retailOrg_id,
        user_id: user._id
      };
  
    } catch (error) {
      console.error("Error in login:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      };
    }
  },
  


      sendEmail: async (data) => {
        const { email, otp } = data
        try {
          const transporter = nodemailer.createTransport({
            // service: "gmail",
            // auth: {
            //   user: process.env.EMAIL_USER,
            //   pass: process.env.EMAIL_PASS,
            // },
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
    
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            // text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="text-align: center; color: #4CAF50;">Your One-Time Password</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Use the following OTP to complete your verification. The OTP is valid for <strong>5 minutes</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="display: inline-block; background-color: #4CAF50; color: white; font-size: 24px; padding: 15px 30px; border-radius: 8px; letter-spacing: 2px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #999;">If you didn't request this, please ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
              </div>
            </div>
          `,
          };
    
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Error sending email:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },
    

      sendOTP: async (data) => {
        const {email} = data
        try {
          const existEmail = await userModel().findOne({ email });
          if (!existEmail) {
            console.log("email not found");
            throw { status:400, message: "email not found" };
          }
    
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 
    
          await otpModel().findOneAndUpdate(
            { email }, 
            { otp, otpExpires },
            { upsert: true, new: true } 
          );
    
          // Send OTP to the email
          await authService.sendEmail({ email, otp });
          console.log(email, otp);
          return { message: "OTP sent to your email" };
        } catch (error) {
          console.error("Error sending OTP:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },
    
      verifyOTP: async (data) => {
        const {email, otp} = data
        try {
          const otpEntry = await otpModel().findOne({ email });
    
          if (!otpEntry) {
            throw {status:400, message: "OTP not found for this email" };
          }
    
    
          if (new Date() > otpEntry.otpExpires) {
            throw { status: 400, message: "OTP has expired" };
          }
    
         const updatedOtp = await otpModel().findOneAndUpdate({ email }, { $set: { verified: true } });
    
         return { success: true, message: "OTP verification successful",updatedOtp };
        } catch (error) {
          console.error("Error verifying OTP:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },
    
      resetPassword: async (data) => {
        
        const {email, password, confirmPassword} = data
        console.log("hii");
        console.log(data);
        try {
    
          if( password !== confirmPassword){
            throw {status:400, message:"password not matched"}
          }
    
          const user = await userModel().findOne({ email });

          if (!user) {
            throw { status: 400, message: "User not found" };
          }
          const role = await roleModel().findById(user.role_id);
          if (!role || role.role_name !== 'Admin') {
            throw { status: 403, message: "Only admins can reset password" };
          }

          const otpEntry = await otpModel().findOne({ email });
    
          if (!otpEntry || !otpEntry.verified) {
            throw { status:400, message: "OTP not verified" };
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const updatedUser = await userModel().findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true } 
          );
    
          if (!updatedUser) {
            throw { status:400, message: "User not found" };
          }
    
          await otpModel().deleteOne({ email });
    
          return { message: "Password reset successfully" , updatedUser};
        } catch (error) {
          console.error("Error resetting password:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          };
        }
      },
      

}

export default authService