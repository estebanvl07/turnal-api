import express from "express";
import {
  getCareServicesById,
  getCareServices,
} from "@/controllers/careServices.controller";

const router = express();

router.get("/", getCareServices);
router.get("/:id", getCareServicesById);
// router.post("/", createCareService);

export { router };
