import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import { Request, Response, NextFunction } from 'express';
import morgan from "morgan";
import logger from "./utils/logger";
import fs from "fs";
import path from "path";


const app = express();

app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const accessLogStream = fs.createWriteStream(
  path.join("logs", "access.log"),
  { flags: "a" }
);

app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

// routes
app.use("/api/auth", authRoutes);

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
    console.error(err.stack);
    res.status(500).json({message: err.message})
})

export default app;