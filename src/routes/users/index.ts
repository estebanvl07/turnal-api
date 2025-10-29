import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  getUsersByCenterId,
  changeCenter,
  changePlace,
  updateUser,
  changeState,
  resetPassword,
} from "@controllers/users.controller";

const router = express();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id/reset-password", resetPassword);
router.get("/center/:centerId", getUsersByCenterId);

router.put("/:id", updateUser);
router.patch("/:userId/:centerId", changeCenter);
router.patch("/:userId/:placeOfCareId/places", changePlace);

router.patch("/:id/state", changeState);
// router.put("/users/:id", getUser)
// router.delete("/users:id", getUser)

export { router };
