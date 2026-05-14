import { describe, it, expect, vi } from "vitest";
import { JwtService } from "../../src/security/jwt.service";
import { JWTPayload } from "../../src/modules/auth/auth.validation";

// Mock the environment config
vi.mock("../../src/config/env", () => ({
  default: {
    jwtSecret: "testSecret",
    jwtExpiresIn: "1h",
  },
}));

describe("JwtService", () => {
  const payload: JWTPayload = {
    userId: "user-123",
    companyId: "comp-456",
    role: "ADMIN",
  };

  it("should sign a token correctly", () => {
    const token = JwtService.sign(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should verify a signed token and return the payload", () => {
    const token = JwtService.sign(payload);
    const decoded = JwtService.verify(token);
    
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.companyId).toBe(payload.companyId);
    expect(decoded.role).toBe(payload.role);
  });

  it("should throw an error for invalid tokens", () => {
    expect(() => JwtService.verify("invalid.token.here")).toThrow();
  });
});
