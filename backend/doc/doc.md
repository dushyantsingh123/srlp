📁 Backend Documentation
SRLP Backend Documentation
📌 Project Overview

This backend is built using:

Node.js + Express
TypeScript
Prisma ORM
PostgreSQL

It follows:

Modular architecture
Multi-tenant design (Company-based isolation)
⚙️ Initial Setup
1. Initialize Project
npm init -y
2. Install Dependencies
npm install express cors dotenv bcrypt jsonwebtoken
3. Install Dev Dependencies
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken
4. Initialize TypeScript
npx tsc --init
🧱 Project Structure
backend/
 ├── src/
 │   ├── config/
 │   │   └── prisma.ts
 │   ├── modules/
 │   │   └── auth/
 │   │       ├── auth.controller.ts
 │   │       ├── auth.service.ts
 │   │       ├── auth.route.ts
 │   ├── app.ts
 │   └── server.ts
 ├── prisma/
 │   └── schema.prisma
 ├── prisma.config.ts
 ├── .env
🗄️ Database Setup (Prisma)
Initialize Prisma
npx prisma init
Run Migration
npx prisma migrate dev --name init
Generate Prisma Client
npx prisma generate
for prisma studio
npx prisma studio
🔐 Core Schema (Summary)
Company → Root entity
User → belongs to Company
Warehouse → belongs to Company
UserWarehouse → many-to-many mapping
🔗 Prisma Setup
File: src/config/prisma.ts
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export default prisma;
🔐 Auth Module
API: Register User
Endpoint
POST /api/auth/register
Request Body
{
  "companyName": "ABC Pvt Ltd",
  "email": "admin@test.com",
  "password": "123456"
}
🔄 Flow
Create Company
Hash Password (bcrypt)
Create User (Admin)
Link user to company
🔒 Security
Password must be hashed using bcrypt
JWT will be used for authentication (next phase)
🧠 Key Concepts
Concept	Explanation
Multi-tenant	Each company has isolated data
Foreign Key	companyId links user to company
Mapping Table	UserWarehouse handles many-to-many
Prisma Client	Used for DB queries
🛠️ Run Server
npm run dev
🚀 Next Steps
Login API
JWT Authentication
Role-based access control
Warehouse assignment