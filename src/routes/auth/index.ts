import { loginUser, registerUser } from "@/controllers/auth.controller";
import express from "express";

const router = express();

router.post("/signin", loginUser);
router.post("/signup", registerUser);

export { router };
