import "dotenv/config";

type Env = {
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  port: number;
  nodeEnv: string;
  corsOrigin: string | undefined;
};

const required = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 5000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

const optionalString = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const validateJwtExpiresIn = (value: string): string => {
  const regex = /^(\d+)(m|h|d|w|y)$/;
  if (!regex.test(value)) {
    throw new Error(
      "JWT_EXPIRES_IN must be a valid format (e.g., '1h', '7d', '30m')"
    );
  }
  return value;
};

const env: Env = {
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: validateJwtExpiresIn(process.env.JWT_EXPIRES_IN?.trim() || "1d"),
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV?.trim() || "development",
  corsOrigin: optionalString(process.env.CORS_ORIGIN),
};

export default env;
