import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { loginUser, registerUser } from "../controllers/authController";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login", loginUser);

export default router;
