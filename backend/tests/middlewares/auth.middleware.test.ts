import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware } from "../../src/middlewares/auth.middleware";
import { JwtService } from "../../src/security/jwt.service";
import ApiError from "../../src/shared/helpers/ApiError";

// mock JwtService so we don't need a real token
vi.mock("../../src/security/jwt.service");

const mockRes = {} as any;

const makeReq = (authHeader?: string) => ({
    headers: {
        authorization: authHeader,
    },
}) as any;

/**
 * Helper to run Express middleware wrapped in asyncHandler.
 * Resolves on success (next() called with no error).
 * Rejects with the error if next(err) is called.
 */
const runMiddleware = (middleware: any, req: any, res: any) => {
    return new Promise<void>((resolve, reject) => {
        middleware(req, res, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

beforeEach(() => {
    vi.clearAllMocks(); // reset mocks between every test
});

describe("authMiddleware", () => {

    it("should attach req.user and call next() when token is valid", async () => {
        const fakePayload = { userId: "1", companyId: "c1", role: "ADMIN" };
        vi.mocked(JwtService.verify).mockReturnValue(fakePayload);

        const req = makeReq("Bearer validtoken123");
        await runMiddleware(authMiddleware, req, mockRes);

        expect(req.user).toEqual(fakePayload);
    });

    it("should throw 401 when Authorization header is missing", async () => {
        const req = makeReq(undefined);

        await expect(runMiddleware(authMiddleware, req, mockRes))
            .rejects.toThrow(ApiError);
    });

    it("should throw 401 when Bearer format is invalid", async () => {
        const req = makeReq("InvalidFormatToken");

        await expect(runMiddleware(authMiddleware, req, mockRes))
            .rejects.toThrow(ApiError);
    });

    it("should throw 401 when token signature is invalid or expired", async () => {
        vi.mocked(JwtService.verify).mockImplementation(() => {
            throw new Error("invalid signature");
        });

        const req = makeReq("Bearer expiredtoken123");

        await expect(runMiddleware(authMiddleware, req, mockRes))
            .rejects.toThrow();
    });

});