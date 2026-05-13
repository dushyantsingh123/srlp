import { describe, it, expect } from "vitest";
import { PasswordService } from "../../src/security/password.service";

describe("PasswordService", () => {
  it("should correctly hash a password", async () => {
    const password = "mySecretPassword";
    const hash = await PasswordService.hash(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("should correctly compare a password and its hash", async () => {
    const password = "mySecretPassword";
    const hash = await PasswordService.hash(password);
    
    const isMatch = await PasswordService.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it("should return false for incorrect passwords", async () => {
    const password = "mySecretPassword";
    const hash = await PasswordService.hash(password);
    
    const isMatch = await PasswordService.compare("wrongPassword", hash);
    expect(isMatch).toBe(false);
  });
});
