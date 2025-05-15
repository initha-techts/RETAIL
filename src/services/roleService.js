
import roleModel from "../models/retailModel/roleModel.js";

const roleService = {

  roleAccess: async (data) => {
    const {retailorg_id, role_name, permission} = data;
  
    try {
      const roleData = { role_name, permission };
  
      const requesterRole = await roleModel().findById(admin_id);
  
      if (!requesterRole) {
        throw { status: 400, message: "Requester's role not found" };
      }
  
      if (requesterRole.role_name !== "admin") {
        throw { status: 403, message: "Access Denied: Only Admin can add role in org" };
      }
  
  
    } catch (error) {
      console.error("Error in adding:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      };
    }
  }
  
}

export default roleService