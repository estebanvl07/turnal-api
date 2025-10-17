import { getIps } from "@/controllers/ips.controller";
import express from "express";

const router = express();

router.get("/", getIps);

// router.put("/:id", (req, res) => {
//     res.send("ips");
// });

export { router };
