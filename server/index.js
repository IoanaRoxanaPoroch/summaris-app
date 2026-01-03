import "dotenv/config";
import express from "express";
import { existsSync, mkdirSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { LOG_MESSAGES, SUCCESS_MESSAGES } from "./constants/messages.js";
import clerkWebhookRoutes from "./routes/clerkWebhookRoute.js";
import documentRoutes from "./routes/documentRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoute.js";
import userRoutes from "./routes/userRoute.js";
import { logError, logInfo } from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creează directorul pentru loguri dacă nu există
const logsDir = path.join(__dirname, "logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Root route - API information
app.get("/", (req, res) => {
  res.json({
    message: SUCCESS_MESSAGES.API_SERVER_NAME,
    version: "1.0.0",
    endpoints: {
      users: {
        "GET /users/api": "Get all users",
        "GET /users/api/:id": "Get user by ID",
        "GET /users/api/email?email=...": "Get user by email",
        "POST /users/api": "Create new user",
        "PUT /users/:id": "Update user",
        "DELETE /users/:id": "Delete user",
      },
      documents: {
        "GET /documents/api": "Get all documents",
        "GET /documents/api/:id": "Get document by ID",
        "PUT /documents/:id": "Update document",
        "DELETE /documents/:id": "Delete document",
      },
      webhooks: {
        "POST /webhooks/clerk": "Clerk webhook endpoint",
      },
    },
  });
});

app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/webhooks/clerk", clerkWebhookRoutes);
app.use("/subscriptions", subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logError(LOG_MESSAGES.UNHANDLED_EXPRESS_ERROR, err, {
    path: req.path,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.listen(8080, () => {
  logInfo("Server started successfully", { port: 8080 });
});
