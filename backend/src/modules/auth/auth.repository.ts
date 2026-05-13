import { Company, Prisma, User } from "@prisma/client";
import prisma from "../../config/prisma";

export const findUserByEmail = (email: string): Promise<User | null> =>
  prisma.user.findUnique({
    where: { email },
  });

export const createCompanyWithUser = async (
  data: {
    companyName: string;
    name: string;
    email: string;
    hashedPassword: string;
  },
  tx: Prisma.TransactionClient
): Promise<{ company: Company; user: User }> => {
  const company = await tx.company.create({
    data: {
      name: data.companyName,
      type: "HQ",
    },
  });

  const user = await tx.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.hashedPassword,
      companyId: company.id,
    },
  });

  return { company, user };
};

export const runAuthTransaction = <T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
) => prisma.$transaction(callback);
