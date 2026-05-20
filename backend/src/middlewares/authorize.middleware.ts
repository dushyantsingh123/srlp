import { Request, Response, NextFunction } from "express";
import { UserRole } from "../constants/auth.constants";
import ApiError from "../shared/helpers/ApiError";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const userRole = req.user?.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            throw ApiError.forbidden(AUTH_MESSAGES.UNAUTHORIZED_FORBIDDEN)
        }

        next();
    };
};