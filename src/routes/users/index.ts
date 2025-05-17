import express from "express";
import {
  getUsers,
  createUser,
  getUsersByCenterId,
  changeCenter,
  changePlace,
  updateUser,
  changeState,
} from "@controllers/users.controller";

const router = express();

router.get("/", getUsers);
router.get("/:centerId", getUsersByCenterId);
router.post("/", createUser);

router.put("/:id", updateUser);
router.patch("/:userId/:centerId", changeCenter);
router.patch("/:userId/:placeOfCareId/places", changePlace);

router.patch("/:id/state", changeState);
// router.put("/users/:id", getUser)
// router.delete("/users:id", getUser)

export { router };
