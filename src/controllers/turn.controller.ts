import turnService from "@/services/turn/turn.service";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const createTurn: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.ipsId! as string;
    const body = req.body as Prisma.TurnUncheckedCreateInput;
    const turn = await turnService.createTurn({ ...body, ipsId });
    res.status(200).json({ data: turn });
  } catch (error) {
    res.status(400).json(error);
  }
};
