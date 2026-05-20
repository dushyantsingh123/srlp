import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import { getCurrentUser, login, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/authorize.middleware";
import { UserRole } from "../../constants/auth.constants";

const router = Router();

// public routes
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

// protected routes
// protected routes
router.get("/me", authMiddleware, authorizeRoles(UserRole.ADMIN), getCurrentUser);

export default router;
