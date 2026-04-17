import prisma from "../../config/prisma";
import bcrypt from "bcrypt";

// ✅ Define type instead of any
interface RegisterInput {
  companyName: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput) => {
  const { companyName, email, password } = data;

  // 1. Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Transaction (create company + user)
  const result = await prisma.$transaction(async (tx:any) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
      },
    });

    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        companyId: company.id,
      },
    });

    return {
      company,
      user,
    };
  });

  // 4. Return final response
  return {
    message: "User registered successfully",
    data: result,
  };
};