import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import ApiError from "../shared/helpers/ApiError";

export const validateBody =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody as any;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) => err.message).join(", ");
        return next(ApiError.badRequest(message));
      }
      return next(error);
    }
  };

export const validateQuery =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedQuery = await schema.parseAsync(req.query);
      req.query = parsedQuery as any;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) => err.message).join(", ");
        return next(ApiError.badRequest(message));
      }
      return next(error);
    }
  };

export const validateParams =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = await schema.parseAsync(req.params);
      req.params = parsedParams as any;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) => err.message).join(", ");
        return next(ApiError.badRequest(message));
      }
      return next(error);
    }
  };
