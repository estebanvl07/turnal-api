import express from "express";
import { getUsers, createUser } from "@controllers/users.controller";

const router = express();

// TODO: add authentication middleware
//      router.get("/users", authJWT, getUser)

router.get("/", getUsers);
router.post("/", createUser);
// router.put("/users/:id", getUser)
// router.delete("/users:id", getUser)

export { router };
