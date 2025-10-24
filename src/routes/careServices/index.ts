import express from "express";
import {
  getCareServicesById,
  getCareServices,
  addServiceToCareCenter,
  removeServiceFromCareCenter,
} from "@/controllers/careServices.controller";

const router = express();

router.get("/", getCareServices);
router.get("/:id", getCareServicesById);

router.put("/:id/service", addServiceToCareCenter);
router.delete("/:centerId/service/:serviceId", removeServiceFromCareCenter);
// router.post("/", createCareService);

export { router };
