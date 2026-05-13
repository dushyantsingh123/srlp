import { NextFunction, Request, Response } from "express";
import ApiError from "../shared/helpers/ApiError";
import logger from "../monitoring/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: err.message,
  });

  res.status(statusCode).json({ message });
};
