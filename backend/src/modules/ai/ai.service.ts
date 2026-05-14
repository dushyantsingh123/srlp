import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../../config/env";
import { SYSTEM_PROMPT } from "../../shared/prompt/system.prompt";
import ApiError from "../../shared/helpers/ApiError";
import logger from "../../monitoring/logger";
import { AIResponse } from "./ai.validation";
import { AI_MESSAGES, AI_MODELS } from "../../constants/ai.constants";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

export const generateZeroShotPrompt = async (
  prompt: string
): Promise<{ message: string; data: AIResponse }> => {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    logger.warn("AI prompt generation failed - missing prompt");
    throw ApiError.badRequest(AI_MESSAGES.PROMPT_REQUIRED);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: AI_MODELS.GEMINI_2_5_FLASH,
    });

    const finalPrompt = `
${SYSTEM_PROMPT}

User Question:
${normalizedPrompt}
`;

    const result = await model.generateContent(finalPrompt);
    const text = result.response.text().trim();

    if (!text) {
      logger.error("AI prompt generation failed - empty response", {
        model: AI_MODELS.GEMINI_2_5_FLASH,
      });
      throw new ApiError(502, AI_MESSAGES.EMPTY_RESPONSE);
    }

    logger.info("AI prompt generated successfully", {
      model: AI_MODELS.GEMINI_2_5_FLASH,
      promptLength: normalizedPrompt.length,
    });

    return {
      message: AI_MESSAGES.GENERATE_SUCCESS,
      data: {
        text,
        model: AI_MODELS.GEMINI_2_5_FLASH,
      },
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    logger.error("AI prompt generation failed", {
      error: error?.message || "Unknown error",
      model: AI_MODELS.GEMINI_2_5_FLASH,
    });

    throw new ApiError(502, AI_MESSAGES.GENERATE_FAILED);
  }
};