import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import * as aiController from "./ai.controller";

import {
    createZeroShotPromptSchema,
} from "./ai.validation";

const router = Router();

router.post(
    "/zero-shot",
    validateBody(createZeroShotPromptSchema),
    aiController.createZeroShotPrompt
);

export default router;