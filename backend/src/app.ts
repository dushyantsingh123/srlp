import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";

const app = express();

//Use cors here 
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

export default app;