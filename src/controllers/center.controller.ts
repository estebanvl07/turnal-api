import centerService from "@/services/center/center.service";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const createCenter: RequestHandler = async (req, res) => {
  try {
    const data = req.body as Prisma.CareCenterUncheckedCreateInput;

    const center = await centerService.createCenter({
      ...data,
      ipsId: req.ipsId!,
    });
    res.status(200).json({ data: center });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getCenters: RequestHandler = async (req, res) => {
  try {
    const centers = await centerService.getCenters({ ipsId: req.ipsId! });

    console.log(centers);

    res.status(200).json({ data: centers });
  } catch (error) {
    res.status(400).json(error);
  }
};
