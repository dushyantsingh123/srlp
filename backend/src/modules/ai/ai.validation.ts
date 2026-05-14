import { z } from "zod";
import { AI_LIMITS, AI_MESSAGES } from "../../constants/ai.constants";

export const createZeroShotPromptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, AI_MESSAGES.PROMPT_REQUIRED)
    .max(AI_LIMITS.MAX_PROMPT_LENGTH, AI_MESSAGES.PROMPT_TOO_LONG),
});

export type PromptInput = z.infer<typeof createZeroShotPromptSchema>;

export const aiResponseSchema = z.object({
  text: z.string(),
  model: z.string(),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

export const geminiResponseSchema = z.object({
  candidates: z.array(z.unknown()),
});

export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
