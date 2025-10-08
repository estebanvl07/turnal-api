import express from "express";
import {
  createStatus,
  getStatus,
  updateStatus,
} from "@controllers/status.controller";

const router = express();

// router.get("/", getUsers);
router.post("/", createStatus);

router.put("/:id", updateStatus);
router.get("/", getStatus);
// router.get("/:centerId", getUsersByCenterId);

export { router };
