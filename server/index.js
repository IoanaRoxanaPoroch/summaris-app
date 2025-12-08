import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import documentRoutes from "./routes/documentRoute.js";
import userRoutes from "./routes/userRoute.js";
import clerkWebhookRoutes from "./routes/clerkWebhookRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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
    message: "Summaris API Server",
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

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
