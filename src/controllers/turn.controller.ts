import turnService from "@/services/turn/turn.service";
import { CreateTurnInput } from "@/services/turn/type";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const createTurn: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.ipsId! as string;
    const user = req.user;
    const body = req.body as CreateTurnInput;

    const payload = {
      ...body,
      ipsId: req.ipsId!,
      userId: user?.id!,
      isPriority: Boolean(body.priorityId),
      statusId: 1,
    };

    const turn = await turnService.createTurn(payload);
    res.status(200).json({ data: turn });
  } catch (error) {
    res.status(400).json(error);
  }
};
