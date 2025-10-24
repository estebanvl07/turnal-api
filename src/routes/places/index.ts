import express from "express";
import {
  createPlace,
  getPlaces,
  assignUser,
  assignService,
  updatePlace,
  updatePlaceStatus,
} from "@/controllers/places.controller";

const router = express();

router.get("/", getPlaces);

router.post("/", createPlace);
router.put("/:placeId", updatePlace);
router.patch("/:placeId/status", updatePlaceStatus);

router.patch("/:placeId/user", assignUser);
router.patch("/:placeId/service", assignService);
// router.put("/:id", (req, res) => {
//     res.send("ips");
// });

export { router };
