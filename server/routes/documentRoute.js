import express from "express";
import documentController from "../controllers/documentController.js";
import documentControllerMVC from "../controllers/documentControlller_MVC.js";

const router = express.Router({ strict: false });
const { getAllView, createView, editView, getByIdView, create, update: updateMVC } = documentControllerMVC;
const { getAll, getById, getByEmail, getByUserId, update, deleteDoc, upload, summarize, getSummariesByEmail, getSummariesByUserId } = documentController;

// API routes — defined before parameterized view routes to avoid conflicts
router.get("/api", getAll);
router.get("/api/by-email", getByEmail);
router.get("/api/by-user", getByUserId);
router.get("/api/summaries", getSummariesByEmail);
router.get("/api/summaries/by-user", getSummariesByUserId);
router.get("/api/:id", getById);
router.post("/api/upload", upload);
router.post("/api/:id/summarize", summarize);

// View routes
router.get("/", getAllView);
router.get("/create", createView);
router.get("/edit/:id", editView);
router.get("/:id", getByIdView);
router.post("/create", create);
router.post("/edit/:id", updateMVC); // MVC route pentru form-uri
router.put("/:id", update); // API route
router.delete("/:id", deleteDoc);

export default router;





