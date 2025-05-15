import express from "express"

import roleController from "../controllers/roleController.js"

const route = express.Router()

route.post("/add_role", roleController.roleAccess)

export default route