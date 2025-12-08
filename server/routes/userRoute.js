import express from "express";
import userController from "../controllers/userController.js";
import userController_MVC from "../controllers/userController_MVC.js";

const router = express.Router({ strict: false });
const { getAllView, createView, editView, getByIdView } = userController_MVC;
const { getAll, getById, create, createAPI, getUserByEmail, update, deleteUser } = userController;

router.get("/", getAllView);
router.get("/create", createView);
router.get("/edit/:id", editView);
router.get("/:id", getByIdView);

router.get("/api", getAll);
router.get("/api/:id", getById);
router.get("/api/email", getUserByEmail); // Get user by email
router.post("/api", createAPI); // API endpoint for creating users (returns JSON)
router.post("/create", create);
router.post("/edit/:id", update);
router.put("/:id", update);
router.delete("/:id", deleteUser);

export default router;
