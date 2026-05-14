# SRLP Backend Developer Guide

This document is the quick onboarding guide for humans. It explains:
- project flow end-to-end
- which folder is used for what
- how to add a new module correctly
- how files are linked together

For junior/intern step-by-step KT, also read:
- `docs/JUNIOR_KT_GUIDE.md`

---

## 1) Project Flow (High Level)

The backend follows a modular Express architecture:

1. `src/server.ts` starts the app.
2. `src/app.ts` registers global middleware and feature routes.
3. Request enters middleware chain (request id, logging, parsers, CORS).
4. Request hits feature route (example: `/api/auth`, `/api/ai`).
5. Validation middleware checks request body/query/params.
6. Controller receives validated input and calls service.
7. Service runs business logic and DB/external calls.
8. Service returns `{ message, data }`.
9. Controller returns response via shared helper (`sendSuccess`).
10. Errors are handled by global `errorMiddleware`.

Keep controllers thin and services smart.

---

## 2) Folder Responsibilities + Libraries Used

| Folder | Responsibility | Main Libraries/Skills |
| :--- | :--- | :--- |
| `src/server.ts` | Process start, crash safety handlers | Node process events |
| `src/app.ts` | App wiring: middleware + route registration | `express`, `cors`, `morgan` |
| `src/config` | Environment validation + Prisma setup | `dotenv`, `@prisma/client`, `pg` |
| `src/modules/<feature>` | Feature code (route/controller/service/validation/repository) | `express`, `zod`, Prisma, service design |
| `src/middlewares` | Reusable request validation and global error handling | `express`, `zod` |
| `src/security` | JWT + password utilities | `jsonwebtoken`, `bcrypt` |
| `src/shared/helpers` | Shared helpers (`ApiError`, `sendSuccess`) | shared response/error patterns |
| `src/utils` | Generic reusable utilities (for example `asyncHandler`) | TypeScript utility patterns |
| `src/shared/prompt` | AI prompt templates | prompt engineering templates |
| `src/constants` | App-wide messages, limits, fixed values | TypeScript constants/enums |
| `src/monitoring` | Logger + request tracing | `winston`, request correlation |
| `prisma` | Schema + migrations | Prisma schema + migration workflow |
| `tests` | Unit/integration tests | `vitest`, mocks, assertions |

---

## 3) Standard Logic Link (How Files Connect)

For each module:

- `*.route.ts`: declares endpoint + middleware order
- `*.validation.ts`: Zod schema and input/output types
- `*.controller.ts`: receives request, calls service, sends response
- `*.service.ts`: business logic, logging, DB/external calls, error mapping
- `*.repository.ts` (optional): DB query helpers for complex modules

### Request flow example

`route -> validateBody(schema) -> controller -> service -> (repository/prisma/external) -> controller -> response`

### Who calls whom (important for new developers)

- `route` calls middleware and then controller.
- `validation` is used by `route` (not by service directly).
- `controller` calls only `service` and `sendSuccess`.
- `service` calls `repository` (if present), `prisma` (if needed), logger, security/shared helpers.
- `repository` calls only Prisma and returns data.
- `errorMiddleware` catches thrown errors from all layers.

Never call `controller` from service. Never call `route` from service. Keep one-way dependency flow.

---

## 4) `product.service.ts` vs `product.repository.ts` (Clear Difference)

Both can exist, but they have different jobs:

- `product.service.ts` (business layer)
  - validates business rules beyond schema
  - decides what should happen
  - composes multiple operations
  - logs important events/failures
  - throws `ApiError` for business/operational failures
  - returns `{ message, data }` to controller

- `product.repository.ts` (data access layer)
  - contains DB query functions only
  - no HTTP concerns
  - no response formatting
  - no route/controller imports
  - minimal logic; focused on query correctness and reusability

Rule: if DB calls are simple and few, service can call Prisma directly.  
If DB queries become complex/reused, move them to repository.

---

## 5) What To Do First When Adding New Module

When adding `product` module, use this order:

1. **Create folder**
   - `src/modules/product/`
2. **Create base files**
   - `product.route.ts`
   - `product.controller.ts`
   - `product.service.ts`
   - `product.validation.ts`
   - `product.repository.ts` (only if needed)
3. **Add constants**
   - Add `PRODUCT_MESSAGES` and limits in `src/constants` (or module-local constants if small)
4. **Define Zod schemas**
   - Request schema first, then inferred types
5. **Implement service logic**
   - No HTTP response handling in service
   - Throw `ApiError` for business failures
   - Use logger for important events and failures
6. **Implement thin controller**
   - Parse typed request
   - call service
   - return `sendSuccess(res, status, message, data)`
7. **Wire routes**
   - Use validation middleware before controller
8. **Register route in `src/app.ts`**
   - `app.use("/api/products", productRoutes)`
9. **Add tests**
   - Unit tests for service/util logic
10. **Run validation commands**
   - `npm test`

---

## 6) Product Module Flow (Exact Call Sequence)

When creating a Product API, use this exact order:

1. `src/constants/product.constants.ts`
   - define `PRODUCT_MESSAGES`, limits, and fixed values
2. `product.validation.ts`
   - create Zod request schemas and inferred types
3. `product.repository.ts` (optional)
   - add reusable Prisma query functions
4. `product.service.ts`
   - import constants, validation, repository/prisma, logger, `ApiError`
   - implement business logic and return `{ message, data }`
5. `product.controller.ts`
   - import service + `sendSuccess` + `asyncHandler`
   - call service and return success response
6. `product.route.ts`
   - import controller + `validateBody` + schemas
   - wire endpoint and middleware order
7. `src/app.ts`
   - register route: `app.use("/api/products", productRoutes)`
8. test and validate
   - run endpoint tests and `npm test`

### One endpoint example (what to call where)

- Route: calls `validateBody(createProductSchema)` then `createProductController`
- Controller: calls `createProductService(input)`
- Service: calls `createProductRepository(data)` or Prisma directly
- Repository: performs Prisma `create/find/update` query

This keeps flow clean and prevents architecture breakage.

---

## 7) API and Response Convention

Keep responses consistent:

- Success:
  ```json
  { "message": "Success message", "data": {} }
  ```
- Error:
  ```json
  { "message": "Error message" }
  ```

Use shared helpers and middleware; do not create feature-specific response formats unless explicitly approved.

---

## 8) Utils Usage Guide (`src/utils`)

Use `src/utils` for cross-module generic utilities that are not domain-specific.

Current example:
- `src/utils/asyncHandler.ts`
  - wraps async controllers
  - forwards errors to `errorMiddleware`
  - avoids repeated try/catch in every controller

When to add a new util:
- it is reused by multiple modules
- it has no feature-specific business logic
- it does not depend on a specific module (`auth`, `ai`, `product`, etc.)

Do not put business logic in `src/utils`; keep business logic in `src/modules/<feature>/`.

---

## 9) Test Guide (`tests`)

`tests` is for automated validation of behavior and regressions.

Current baseline:
- `tests/security/password.service.test.ts`
- `tests/security/jwt.service.test.ts`

Recommended test placement:
- `tests/<feature>/` for feature tests
- keep test filenames aligned with source files

What to test first for a new module:
1. service success path
2. service failure path (validation/business errors)
3. security-sensitive behavior (if any)
4. endpoint integration flow (route -> middleware -> controller -> service)

Test command:
- `npm test`
  - runs typecheck + Prisma schema validation + unit tests

---

## 10) Database Change Flow (Prisma)

1. Update `prisma/schema.prisma`
2. Create migration:
   - `npx prisma migrate dev --name <change_name>`
3. Validate schema:
   - `npm run prisma:validate`
4. Check app compiles/tests:
   - `npm test`

Do not run production migration changes without human approval.

---

## 11) Coding Rules (Daily Checklist)

- Keep diffs small and incremental.
- Reuse shared helpers/middleware; avoid duplicated logic.
- Keep architecture consistent with existing modules (`auth` is reference style).
- Put constant messages/limits in constants, not hardcoded strings.
- Avoid `any`; use inferred Zod types or explicit interfaces.
- Use `async/await` and centralized error handling.
- Do not log secrets/tokens/passwords.

---

## 12) Practical Example Mapping

If you are building `POST /api/products`:

1. Add `createProductSchema` in `product.validation.ts`
2. Add `createProduct()` in `product.service.ts`
3. Add `createProductController()` in `product.controller.ts`
4. Add route in `product.route.ts`:
   - `router.post("/", validateBody(createProductSchema), createProductController)`
5. Register module in `src/app.ts`
6. Test endpoint and run `npm test`

This order keeps the flow predictable and easy to maintain.

---

## 13) Current Entry Points

- App startup: `src/server.ts`
- App wiring: `src/app.ts`
- Existing module examples:
  - `src/modules/auth`
  - `src/modules/ai`

Use these modules as reference implementations when adding new features.
