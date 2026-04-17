import prisma from "../../config/prisma";
import bcrypt from "bcrypt";

// ✅ Define type instead of any
interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput) => {
  const { companyName, name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        type: "HQ", // ✅ or "RETAIL" or "FRANCHISE"
      },
    });

    const user = await tx.user.create({
      data: {
        name,
        email,
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
};