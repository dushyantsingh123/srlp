import cors from "cors";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import env from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import {
  requestIdMiddleware,
  requestLogger,
} from "./monitoring/request.logger";
import authRoutes from "./modules/auth/auth.route";
import aiRoutes from "./modules/ai/ai.route";

const app = express();

app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.corsOrigin || true,
  })
);

fs.mkdirSync("logs", { recursive: true });

const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorMiddleware);

export default app;
