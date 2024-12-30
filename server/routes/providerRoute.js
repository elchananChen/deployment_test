import express from "express";

import { verifyToken } from "../middleware/auth.js";
import {
  crateNewProvider,
  getProviderByUserId,
  updateProvider,
} from "../controllers/providerController.js";
const router = express.Router();

router.post("/createNewProvider", verifyToken, crateNewProvider);

router.get("/getProviderByUserId/:userId", getProviderByUserId);

router.patch("/updateProvider", verifyToken, updateProvider);

export default router;
