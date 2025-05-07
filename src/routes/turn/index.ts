import { createTurn } from "@/controllers/turn.controller";
import express from "express";

const router = express();

// router.get("/", (req, res) => {
//   res.send("turns");
// });

router.post("/", createTurn);

export { router };
