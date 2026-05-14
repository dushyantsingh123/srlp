import * as jwt from "jsonwebtoken";
import env from "../config/env";
import { JWTPayload } from "../modules/auth/auth.validation";

export class JwtService {
  /**
   * Signs a JWT payload with the application's secret and expiration settings.
   * Handles type-safe expiration conversion from env.
   */
  static sign(payload: JWTPayload): string {
    const expiresIn = env.jwtExpiresIn as jwt.SignOptions["expiresIn"];

    if (!expiresIn) {
      return jwt.sign(payload, env.jwtSecret);
    }

    return jwt.sign(payload, env.jwtSecret, {
      expiresIn,
    });
  }

  static verify(token: string): JWTPayload {
    return jwt.verify(token, env.jwtSecret) as JWTPayload;
  }
}
