import express from "express";
import documentController from "../controllers/documentController.js";
import documentControllerMVC from "../controllers/documentControlller_MVC.js";

const router = express.Router({ strict: false });
const { getAllView, createView, editView, getByIdView } = documentControllerMVC;
const { getAll, getById, create, update, deleteDoc } = documentController;

router.get("/", getAllView);
router.get("/create", createView);
router.get("/edit/:id", editView);
router.get("/:id", getByIdView);

router.get("/api", getAll);
router.get("/api/:id", getById);
router.post("/create", create);
router.post("/edit/:id", update);
router.put("/:id", update);
router.delete("/:id", deleteDoc);

export default router;





