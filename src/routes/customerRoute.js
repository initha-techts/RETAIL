import express from "express";

import cusController from "../controllers/customerController.js";

const route = express.Router()

route.post("/add_cus", cusController.addCustomer)


export default route