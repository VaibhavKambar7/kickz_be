import express, { Router } from "express";
import {
  registerUser,
  getAllUsers,
  userExists,
} from "../controllers/userController";

const router: Router = express.Router();

router.post("/register", registerUser);
router.get("/allUsers", getAllUsers);
router.post("/userExists", userExists);

export default router;
