import express from "express";
import {
  createUser,
  deleteUsers,
  getAllUsers,
  getUsersById,
  updateUsers,
} from "../controllers/UsersControllers.js";

const router = express.Router();

// GET all users
router.get("/users", getAllUsers);
router.get("/users/:id", getUsersById);
router.delete("/users/:id", deleteUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUsers);

export default router;
