import HTTPStatusCode from "@/config/httpStatusCode";
import servicesService from "@/services/service/services.service";
import turnService from "@/services/turn/turn.service";
import { CreateTurnInput } from "@/services/turn/type";
import { RequestError } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const createTurn: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body as {
      serviceId: string;
      identification: string;
      date: Date;
      priorityId: number;
      placesOfCareId: string;
      careCenterId: string;
    };

    const careCenterId = req.isSuperAdmin
      ? body.careCenterId
      : req.user?.centerId!;
    const placeOfCareId = req.isSuperAdmin
      ? body.placesOfCareId
      : req.user?.placesOfCare?.id!;

    const payload = {
      ipsId: req.ipsId!,
      userId: user?.id!,
      isPriority: Boolean(body.priorityId),
      placesOfCareId: placeOfCareId,
      identification: body.identification,
      serviceId: body.serviceId,
      careCenterId,
      statusId: 1,
    };

    const turn = await turnService.createTurn(payload);
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getTurns: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.ipsId! as string;

    if (req.isSuperAdmin) {
      const turn = await turnService.getTurns({ ipsId });
      res.status(HTTPStatusCode.OK).json({ data: turn });
      return;
    }

    const centerId = req.user?.centerId! as string;
    const turn = await turnService.getTurns({ ipsId, centerId });
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getTurnsByUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const turn = await turnService.getTurnsByUser(userId);
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const createComment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const payload = {
      turnId: Number(id),
      userId: req.user?.id!,
      comment,
    } as Prisma.TurnCommentsUncheckedCreateInput;

    const turn = await turnService.createComment(payload);
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const updateTurnById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data: Prisma.TurnUncheckedUpdateInput = req.body;

    const payload = {
      id: Number(id),
      ...data,
    };

    const turn = await turnService.updateTurnById(Number(id), payload);
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getTurnById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const turn = await turnService.getTurnById(Number(id));
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const updateStateTurn: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      state,
      assignMe = false,
      placesOfCareId,
    } = req.body as {
      state: number;
      assignMe?: boolean;
      placesOfCareId?: string;
    };

    const turn = await turnService.updateStateTurn({
      id: Number(id),
      state: Number(state),
      assignMe,
      placesOfCareId,
      userId: req.user?.id!,
    });
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const updateNextTurn: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const turn = await turnService.updateNextTurn({ id: Number(id) });
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const cleanTurns: RequestHandler = async (req, res) => {
  try {
    const { centerId } = req.body;
    const userId = req.user?.id!;

    const turn = await turnService.cleanTurns({ centerId, userId });
    res.status(HTTPStatusCode.OK).json({ data: turn });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};
