import express from "express";
import {
  createService,
  getServices,
  updateService,
  updateState,
} from "@/controllers/service.controller";

const router = express();

router.post("/", createService);
router.get("/", getServices);

router.post("/:id", updateService);
router.patch("/:id/state", updateState);

export { router };
