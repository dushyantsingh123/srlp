import { AUTH_MESSAGES } from "../../constants/auth.constants";
import { JwtService } from "../../security/jwt.service";
import { PasswordService } from "../../security/password.service";
import ApiError from "../../shared/helpers/ApiError";
import logger from "../../monitoring/logger";
import { LoginInput, RegisterInput } from "../../types/auth.types";
import {
  createCompanyWithUser,
  findUserByEmail,
  runAuthTransaction,
} from "./auth.repository";

export const registerUser = async (data: RegisterInput) => {
  const { companyName, name, email, password } = data;

  if (!companyName || !name || !email || !password) {
    logger.warn("Register failed - missing fields");
    throw ApiError.badRequest(AUTH_MESSAGES.MISSING_FIELDS);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    logger.warn("Register failed - user already exists", {
      email: normalizedEmail,
    });
    throw ApiError.badRequest(AUTH_MESSAGES.USER_EXISTS);
  }

  const hashedPassword = await PasswordService.hash(password);

  try {
    const result = await runAuthTransaction((tx) =>
      createCompanyWithUser(
        {
          companyName,
          name,
          email: normalizedEmail,
          hashedPassword,
        },
        tx
      )
    );

    logger.info("User registered successfully", {
      userId: result.user.id,
      email: result.user.email,
      companyId: result.company.id,
    });

    return {
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: {
        company: result.company,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      },
    };
  } catch (error: any) {
    logger.error("Register transaction failed", {
      error: error.message,
    });

    if (error.code === "P2002") {
      throw ApiError.badRequest(AUTH_MESSAGES.USER_EXISTS);
    }

    throw error;
  }
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  if (!email || !password) {
    logger.warn("Login failed - missing fields");
    throw ApiError.badRequest(AUTH_MESSAGES.MISSING_FIELDS);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (!existingUser) {
    logger.warn("Login failed - user not found", {
      email: normalizedEmail,
    });
    throw ApiError.badRequest(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const isMatched = await PasswordService.compare(password, existingUser.password);

  if (!isMatched) {
    logger.warn("Login failed - invalid password", {
      email: normalizedEmail,
    });
    throw ApiError.badRequest(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = JwtService.sign({
    userId: existingUser.id,
    companyId: existingUser.companyId,
    role: existingUser.role,
  });

  logger.info("User login successful", {
    userId: existingUser.id,
    companyId: existingUser.companyId,
  });

  return {
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: {
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token,
    },
  };
};
