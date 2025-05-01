import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "@/routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL ROUTES
app.use("/api", routes);

export default app;
