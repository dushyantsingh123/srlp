import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import { login, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
