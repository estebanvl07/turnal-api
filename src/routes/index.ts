import express from "express";
import { router as userRoutes } from "./v1/users";
import { router as authRoutes } from "./v1/auth";

const router = express();
const version = "/v1";

// route structure -> /api/users/...etc
// ALL ROUTES

router.use(version, userRoutes);
router.use(version, authRoutes);

export default router;
