import {
  createComment,
  createTurn,
  getTurnById,
  getTurns,
  updateStateTurn,
} from "@/controllers/turn.controller";
import express from "express";

const router = express();

router.get("/", getTurns);
router.get("/:id", getTurnById);

router.post("/", createTurn);
router.post("/:id/comment", createComment);

router.patch("/:id/state", updateStateTurn);

export { router };
