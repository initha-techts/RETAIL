import express from "express"

import dashboardController from "../controllers/dashBoardController.js";

const route = express.Router()

route.get("/lowStock/:store_id", dashboardController.getLowStock)
route.get("/outofStock/:store_id", dashboardController.getOutOfStock)

export default route