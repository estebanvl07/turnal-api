import express from "express";

import {
  createPriority,
  getPriorityByCenterId,
  updatePriority,
} from "@controllers/priority.controller";

const router = express();

router.get("/:centerId", getPriorityByCenterId);

router.post("/", createPriority);
router.put("/", updatePriority);

// router.get("/:id", getStatus);
// router.put("/:id", updateStatus);

// router.put("/order/sort", updateStatusOrder);
// router.get("/:centerId", getUsersByCenterId);

export { router };
