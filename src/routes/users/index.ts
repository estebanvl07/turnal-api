import express from "express";
import {
  getUsers,
  createUser,
  getUsersByCenterId,
  changeCenter,
  changePlace,
} from "@controllers/users.controller";

const router = express();

// TODO: add authentication middleware
//      router.get("/users", authJWT, getUser)

router.get("/", getUsers);
router.get("/:centerId", getUsersByCenterId);
router.post("/", createUser);
router.patch("/:userId/:centerId", changeCenter);
router.patch("/:userId/:placeOfCareId/places", changePlace);
// router.put("/users/:id", getUser)
// router.delete("/users:id", getUser)

export { router };
