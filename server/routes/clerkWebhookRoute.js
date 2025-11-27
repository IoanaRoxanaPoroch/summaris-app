import express from "express";
import clerkWebhookController from "../controllers/clerkWebhookController.js";

const router = express.Router();

// Webhook endpoint for Clerk to sync users
router.post("/", clerkWebhookController.handleWebhook.bind(clerkWebhookController));

export default router;

