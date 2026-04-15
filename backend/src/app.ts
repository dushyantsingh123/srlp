import express from "express";
import cors from "cors";

const app = express();

//Use cors here 
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("SRLP is running");
});

export default app;