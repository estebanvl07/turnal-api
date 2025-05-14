import express from "express";
import { createPlace, getPlaces } from "@/controllers/places.controller";

const router = express();

router.get("/", getPlaces);
router.post("/", createPlace);

// router.put("/:id", (req, res) => {
//     res.send("ips");
// });

export { router };
