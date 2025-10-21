import express from "express";
import {
  createCenter,
  updateCenter,
  getCenters,
  getCentersById,
  getTurnsByCenter,
} from "@/controllers/center.controller";

const router = express();

router.get("/", getCenters);
router.get("/:id", getCentersById);

router.get("/:id/turns", getTurnsByCenter);

router.put("/:id", updateCenter);

router.post("/", createCenter);

export { router };
