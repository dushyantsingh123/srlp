/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { JwtService } from "../security/jwt.service";
import { jwtPayloadSchema } from "../modules/auth/auth.validation";
import ApiError from "../shared/helpers/ApiError";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export const authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED_MISSING_TOKEN);
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED_MALFORMED_TOKEN);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED_MALFORMED_TOKEN);
        }

        try {
            const decoded = JwtService.verify(token);
            const payload = await jwtPayloadSchema.parseAsync(decoded);
            req.user = payload;
            next();
        } catch (error) {
            throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED_INVALID_TOKEN);
        }
    }
)