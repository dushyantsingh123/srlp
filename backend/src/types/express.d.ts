import { JWTPayload } from "../modules/auth/auth.validation";

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export { };