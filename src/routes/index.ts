import express from "express";
import { authJWT } from "@/middlewares/authJWT";

import { router as userRoutes } from "./users";
import { router as authRoutes } from "./auth";
import { router as centerRoutes } from "./centers";
import { router as ipsRoutes } from "./ips";
import { router as serviceRoutes } from "./services";
import { router as turnRoutes } from "./turn";
import { router as placesRoutes } from "./places";
import { router as careServicesRoutes } from "./careServices";
import { router as statusRoutes } from "./status";

const router = express();

// route structure -> /api/[version]/[route]/...etc

router.use("/auth", authRoutes);
router.use("/ips", authJWT, ipsRoutes);
router.use("/services", authJWT, serviceRoutes);
router.use("/centers", authJWT, centerRoutes);
router.use("/users", authJWT, userRoutes);
router.use("/turns", authJWT, turnRoutes);
router.use("/careServices", authJWT, careServicesRoutes);
router.use("/places", authJWT, placesRoutes);
router.use("/status", authJWT, statusRoutes);

export default router;
