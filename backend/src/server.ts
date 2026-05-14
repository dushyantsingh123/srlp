import "dotenv/config";
import app from "./app";
import env from "./config/env";
import logger from "./monitoring/logger";

const server = app.listen(env.port, () => {
  logger.info(`Server is running on Port ${env.port}`);
  console.log(`Server is running on Port ${env.port}`);
});

// Safety Net: Catch unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", {
    message: err.message,
    stack: err.stack,
  });
  server.close(() => {
    process.exit(1);
  });
});

// Safety Net: Catch uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
