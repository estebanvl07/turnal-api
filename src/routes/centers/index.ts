import express from "express";
import { createCenter } from "@/controllers/center.controller";
import { getCenters } from "@/controllers/center.controller";
import { getCentersById } from "@/controllers/center.controller";

const router = express();

router.get("/", getCenters);
router.get("/:id", getCentersById);

router.post("/", createCenter);

export { router };
