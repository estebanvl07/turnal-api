import express from "express";
import dotenv from "dotenv";
import routes from "@/routes";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL ROUTES
app.use("/api", routes);

export { app };
