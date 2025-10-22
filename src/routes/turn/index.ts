import {
  createComment,
  createTurn,
  getTurnById,
  getTurns,
  updateStateTurn,
  getTurnsByUser,
  cleanTurns,
  updateTurnById,
  updateNextTurn,
} from "@/controllers/turn.controller";
import express from "express";

const router = express();

router.get("/", getTurns);

router.get("/:id", getTurnById);
router.put("/:id", updateTurnById);

router.get("/:userId/turns", getTurnsByUser);

router.post("/", createTurn);
router.post("/:id/comment", createComment);

router.patch("/:id/state", updateStateTurn);
router.patch("/:id/next", updateNextTurn);

router.put("/clean/board", cleanTurns);

export { router };
