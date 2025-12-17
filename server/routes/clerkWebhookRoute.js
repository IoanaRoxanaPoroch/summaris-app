import express from "express";
import clerkWebhookController from "../controllers/clerkWebhookController.js";

const router = express.Router();

router.post(
  "/",
  clerkWebhookController.handleWebhook.bind(clerkWebhookController)
);

export default router;
