import express from "express";
import documentController from "../controllers/documentController.js";
import documentControllerMVC from "../controllers/documentControlller_MVC.js";

const router = express.Router({ strict: false });
const { getAllView, createView, editView, getByIdView, create, update: updateMVC } = documentControllerMVC;
const { getAll, getById, update, deleteDoc } = documentController;

router.get("/", getAllView);
router.get("/create", createView);
router.get("/edit/:id", editView);
router.get("/:id", getByIdView);

router.get("/api", getAll);
router.get("/api/:id", getById);
router.post("/create", create);
router.post("/edit/:id", updateMVC); // MVC route pentru form-uri
router.put("/:id", update); // API route
router.delete("/:id", deleteDoc);

export default router;





