import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const body = data === undefined ? { message } : { message, data };
  return res.status(statusCode).json(body);
};
