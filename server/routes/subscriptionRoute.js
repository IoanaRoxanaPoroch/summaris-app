import express from "express";
import subscriptionController from "../controllers/subscriptionController.js";

const router = express.Router({ strict: false });

router.get("/api", subscriptionController.getByEmail);
router.post("/api/select", subscriptionController.selectPlan);

export default router;

