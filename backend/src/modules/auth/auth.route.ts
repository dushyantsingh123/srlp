import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import { getCurrentUser, login, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// public routes
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

// protected routes
router.get("/me", authMiddleware, getCurrentUser);

export default router;
