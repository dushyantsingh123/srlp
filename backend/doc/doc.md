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

🔗 Prisma Setup (Prisma v7)
File: `src/config/prisma.ts`

```typescript
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
```

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

---

## 🛑 Troubleshooting: Prisma 7 Initialization Error

### ❌ Error Description
`PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`

### ❓ Why did this happen?
You are using **Prisma v7**, which introduced significant breaking changes. In Prisma 7:
- The `url` property is no longer allowed in the `datasource` block of `schema.prisma`.
- To connect directly to a database, you MUST now use a **Driver Adapter**.

### 🗂️ Files Modified
| File Path | Change Description |
| :--- | :--- |
| `src/config/prisma.ts` | Refactored to initialize `PrismaClient` using the `PrismaPg` adapter and a `pg` connection pool. |
| `tsconfig.json` | Added `"node"` to `compilerOptions.types` to fix `process.env` recognition. |
| `package.json` | Installed `pg`, `@prisma/adapter-pg`, and `@types/pg`. |
| `prisma/schema.prisma` | Removed/Ensured `url` is absent from `datasource` (Prisma 7 requirement). |

### 📦 New Dependencies Explained

To fix the connection, we added the following packages via `npm install`:

| Package | Purpose | Why we added it |
| :--- | :--- | :--- |
| **`pg`** | PostgreSQL client driver for Node.js. | Prisma 7 no longer connects to Postgres "out of the box" in certain configs; it needs this driver to handle the actual network communication. |
| **`@prisma/adapter-pg`** | Official Prisma-to-Postgres adapter. | This is the "translator". It tells Prisma how to use the `pg` driver to execute its queries. |
| **`@types/pg`** | TypeScript type definitions for `pg`. | Required so that TypeScript doesn't complain when we import `Pool` from the `pg` library. |

### ✅ How we fixed it (Step-by-Step)

#### 1. Configuration in `src/config/prisma.ts`
We had to manually set up the connection bridge:

```typescript
// 1. Load .env variables so process.env.DATABASE_URL is available
import "dotenv/config"; 

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 2. Get the connection string from our environment variables
const connectionString = process.env.DATABASE_URL;

// 3. Create a 'Pool' of connections. 
// Why? This allows multiple database queries to run at once without waiting for a single connection.
const pool = new Pool({ connectionString });

// 4. Create the Adapter. 
// Why? Prisma 7 requires an adapter to bridge its engine with the 'pg' driver.
const adapter = new PrismaPg(pool);

// 5. Initialize the Prisma Client with the adapter.
// Why? This tells Prisma to use our manually configured connection instead of trying to find a URL in the schema.
const prisma = new PrismaClient({ adapter });

export default prisma;
```

#### 2. Environment Fix in `tsconfig.json`
We added `"types": ["node"]` to the `compilerOptions` section.

**Why?**
TypeScript needs to know what "global" variables are available in your environment. Since we are using **Node.js**, variables like `process` (used to read `.env` files) are provided by Node. By default, your configuration was empty (`"types": []`), so TypeScript didn't know what `process` was and threw an error. Adding `node` to the types tells TypeScript: *"I am running on Node.js, please recognize its built-in variables."*