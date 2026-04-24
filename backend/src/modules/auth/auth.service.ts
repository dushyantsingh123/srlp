import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (data: RegisterInput) => {
  const { companyName, name, email, password } = data;

  if (!companyName || !name || !email || !password) {
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
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
    if (error.code === "P2002") {
      throw new Error("User already exists");
    }
    throw error;
  }
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  const isMatched = await bcrypt.compare(password, existingUser.password);

  if (!isMatched) {
    throw new Error("Invalid email or password");
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
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