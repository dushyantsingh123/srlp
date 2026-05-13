import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import logger from "./logger";

/**
 * Middleware to add a unique Request ID to every incoming request.
 * This ID is used for end-to-end tracing in logs.
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  
  // Attach to request and response objects
  (req as any).id = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
};

/**
 * Middleware to log the start and end of every request with its Request ID.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const requestId = (req as any).id;

  logger.info(`Incoming Request`, {
    requestId,
    method,
    url,
    ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    logger.info(`Request Completed`, {
      requestId,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
