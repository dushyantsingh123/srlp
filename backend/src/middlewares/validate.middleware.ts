import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import ApiError from "../shared/helpers/ApiError";

export const validateBody =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) => err.message).join(", ");
        return next(ApiError.badRequest(message));
      }
      return next(error);
    }
  };
