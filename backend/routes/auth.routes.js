// routes/auth.routes.js
import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, me);

export default router;
