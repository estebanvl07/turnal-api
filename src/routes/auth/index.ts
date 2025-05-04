import { loginUser, registerUser } from "@/controllers/auth.controller";
import express from "express";

const router = express();

router.post("/login", loginUser);
router.post("/register", registerUser);

export { router };
