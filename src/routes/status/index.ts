import express from "express";
import {
  createStatus,
  getStatus,
  updateStatus,
  updateStatusOrder,
} from "@controllers/status.controller";

const router = express();

// router.get("/", getUsers);
router.post("/", createStatus);

router.put("/:id", updateStatus);
router.get("/", getStatus);

router.put("/order/sort", updateStatusOrder);
// router.get("/:centerId", getUsersByCenterId);

export { router };
