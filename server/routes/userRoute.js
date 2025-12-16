import express from "express";
import userController from "../controllers/userController.js";
import userController_MVC from "../controllers/userController_MVC.js";

const router = express.Router();

const {
  getAllUsersView,
  createUserView,
  createUser: createUserMVC,
  editUserView,
  updateUser: updateUserMVC,
  getUserByIdView,
} = userController_MVC;

const {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
} = userController;

router.get("/api", getAllUsers);
router.get("/api/email", getUserByEmail);
router.get("/api/:id", getUserById);
router.post("/api", createUser);
router.put("/api/:id", updateUser);
router.delete("/api/:id", deleteUser);

router.get("/", getAllUsersView);
router.get("/create", createUserView);
router.post("/create", createUserMVC);
router.get("/edit/:id", editUserView);
router.post("/edit/:id", updateUserMVC);
router.get("/:id", getUserByIdView);

export default router;
