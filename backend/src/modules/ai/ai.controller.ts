import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { sendSuccess } from "../../shared/helpers/response";
import { PromptInput } from "./ai.validation";
import * as aiService from "./ai.service";

export const createZeroShotPrompt = asyncHandler(
  async (req: Request, res: Response) => {
    const { prompt } = req.body as PromptInput;
    const result = await aiService.generateZeroShotPrompt(prompt);

    sendSuccess(res, 200, result.message, result.data);
  }
);