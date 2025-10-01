import express, { NextFunction } from "express";
import dotenv from "dotenv";
import routes from "@/routes";
import helmet from "helmet";
import cors from "cors";
import { RequestError } from "./utils/errorHandler";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL ROUTES
app.use("/api", routes);

// ERROR HANDLER
app.use((err: RequestError, req: any, res: any, next: NextFunction) => {
  if (err instanceof RequestError) {
    return res.status(err.HttpStatusCode).json({
      message: err.message,
      code: err.HttpStatusCode,
    });
  }

  console.error("❌ Unhandled error:", err);

  return res.status(500).json({
    message: "Internal Server Error",
  });
});

export { app };
