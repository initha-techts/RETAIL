import express from "express";

import planController from "../controllers/planController.js";

const route = express.Router()

route.post("/category", planController.createCategory)
route.post("/create_app", planController.createApp)
route.post("/menu", planController.menuItems)
route.post("/plan", planController.plan)

route.post("/reg", planController.registration)

export default route