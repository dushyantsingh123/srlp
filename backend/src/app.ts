import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import { Request, Response, NextFunction } from 'express';
import morgan from "morgan";
import logger from "./utils/logger";


const app = express();

app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// routes
app.use("/api/auth", authRoutes);

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
    console.error(err.stack);
    res.status(500).json({message: err.message})
})

export default app;