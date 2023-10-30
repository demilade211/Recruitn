import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { registerUser } from "../controllers/authController";

const router = express.Router()

router.route('/register').post(registerUser); 



export default router;