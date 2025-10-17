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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL ROUTES
app.get("/", (req, res) => {
  res.send("Turnal API, v1.0.0");
});

app.use("/api", routes);

export { app };
