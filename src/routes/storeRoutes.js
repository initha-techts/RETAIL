import express from "express"

import storeController from "../controllers/storeController.js";

const route = express.Router()


route.post("/addStore", storeController.addStore)
route.put("/update_store", storeController.updateStore)



route.post("/add_update_store", storeController.addUpdateStore)
route.get("/get_store/:retailOrg_id", storeController.getStore)

export default route