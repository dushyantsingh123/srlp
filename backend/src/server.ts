import "dotenv/config";
import app from "./app";
import env from "./config/env";
import logger from "./monitoring/logger";

app.listen(env.port, () => {
  logger.info(`Server is running on Port ${env.port}`);
  console.log(`Server is running on Port ${env.port}`);
});
