import express from "express";
import { createCenter } from "@/controllers/center.controller";
import { getCenters } from "@/controllers/center.controller";

const router = express();

router.get("/", getCenters);
router.post("/", createCenter);

export { router };
