import express from "express";
import {
  createCenter,
  updateCenter,
  getCenters,
  getCentersById,
} from "@/controllers/center.controller";

const router = express();

router.get("/", getCenters);
router.get("/:id", getCentersById);
router.put("/:id", updateCenter);

router.post("/", createCenter);

export { router };
