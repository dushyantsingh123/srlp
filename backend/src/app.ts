import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";

const app = express();

app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/auth", authRoutes);

export default app;