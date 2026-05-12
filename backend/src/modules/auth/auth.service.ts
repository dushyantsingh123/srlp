import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "./auth.types";
import logger from "../../utils/logger";

export const registerUser = async (data: RegisterInput) => {
  const { companyName, name, email, password } = data;

  if (!companyName || !name || !email || !password) {
    logger.warn("Register failed - missing fields");
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    logger.warn("Register failed - user already exists", {
      email: normalizedEmail,
    });
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          type: "HQ",
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          companyId: company.id,
        },
      });

      return { company, user };
    });

    // ✅ SUCCESS LOG
    logger.info("User registered successfully", {
      userId: result.user.id,
      email: result.user.email,
      companyId: result.company.id,
    });

    return {
      message: "User registered successfully",
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
    // ❌ ERROR LOG
    logger.error("Register transaction failed", {
      error: error.message,
    });

    if (error.code === "P2002") {
      throw new Error("User already exists");
    }
    throw error;
  }
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  if (!email || !password) {
    logger.warn("Login failed - missing fields");
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!existingUser) {
    logger.warn("Login failed - user not found", {
      email: normalizedEmail,
    });
    throw new Error("Invalid email or password");
  }

  const isMatched = await bcrypt.compare(password, existingUser.password);

  if (!isMatched) {
    logger.warn("Login failed - invalid password", {
      email: normalizedEmail,
    });
    throw new Error("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("JWT secret missing");
    throw new Error("JWT secret not configured");
  }

  const token = jwt.sign(
    {
      userId: existingUser.id,
      companyId: existingUser.companyId,
      role: existingUser.role,
    },
    secret,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
    }
  );

  // ✅ SUCCESS LOG
  logger.info("User login successful", {
    userId: existingUser.id,
    companyId: existingUser.companyId,
  });

  return {
    message: "Login successful",
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