export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  CASHIER = "CASHIER",
  MANAGER = "MANAGER",
  SALES = "SALES",
}

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  USER_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  MISSING_FIELDS: "All fields are required",
  UNAUTHORIZED_MISSING_TOKEN: "Unauthorized: missing token",
  UNAUTHORIZED_INVALID_TOKEN: "Unauthorized: invalid token",
  UNAUTHORIZED_MALFORMED_TOKEN: "Unauthorized: malformed token",
  GET_ME_SUCCESS: "User fetched successfully",
  UNAUTHORIZED_FORBIDDEN: "Forbidden: you do not have permission to perform this action",
};



