import express from "express";
import { router as userRoutes } from "./v1/users";

const router = express();
const version = "/v1";

// route structure -> /api/users/...etc
// ALL ROUTES

router.use(version, userRoutes);

export default router;
