
import express from 'express';
// import db from '../config/db.js';
import errorHandling from "../errorHandling.js"
// import userRoutes from '../routes/userRoutes.js';

import db from './db/db.js';
import "dotenv/config";

import planRoute from "./routes/planRoutes.js"
import roleRoute from "./routes/roleRoute.js"
import storeRoute from "./routes/storeRoutes.js"
import authRoute from "./routes/authRoutes.js"
import prodRoute from "./routes/productRoute.js"
import dashBoardRoute from "./routes/dashBoardRoutes.js"
import customerRoute from "./routes/customerRoute.js"
import billRoute from "./routes/billingRoute.js"

const app = express();
const PORT = 3331;

app.use(express.json());

await db.connectDatabases().then(() => {

  app.use(errorHandling)
  // app.use('/users', userRoutes);
   
  app.use("/api", planRoute, roleRoute, storeRoute, authRoute, prodRoute, dashBoardRoute, customerRoute, billRoute)

  app

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
