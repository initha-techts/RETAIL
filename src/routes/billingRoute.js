import express from "express"

import billController from "../controllers/billingController.js"

const route = express.Router()

route.post("/invoice", billController.invoice)

export default route