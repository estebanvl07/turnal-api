import express from "express";
import { createService, getServices } from "@/controllers/service.controller";

const router = express();

router.post("/", createService);
router.get("/", getServices);

export { router };
