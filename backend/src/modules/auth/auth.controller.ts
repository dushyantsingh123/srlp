import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { sendSuccess } from "../../shared/helpers/response";
import { loginUser, registerUser } from "./auth.service";
import { AUTH_MESSAGES } from "../../constants/auth.constants";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);

  sendSuccess(res, 201, result.message, result.data);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  sendSuccess(res, 200, result.message, result.data);
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, companyId, role } = req.user!;

    sendSuccess(res, 200, AUTH_MESSAGES.GET_ME_SUCCESS, {
      userId,
      companyId,
      role,
    });
  }
);
