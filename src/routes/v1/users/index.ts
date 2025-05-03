import express from "express";
import { getUser, createUser } from "@controllers/users.controller";

const router = express();

// TODO: add authentication middleware
//      router.get("/users", authJWT, getUser)

router.get("/users", getUser);
router.post("/users", createUser);
// router.put("/users/:id", getUser)
// router.delete("/users:id", getUser)

export { router };
