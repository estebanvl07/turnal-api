import centerService from "@/services/center/center.service";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import { CreateCenterInput } from "@/services/center/types";
import { RequestError } from "@/utils/errorHandler";
import HTTPStatusCode from "@/config/httpStatusCode";

export const createCenter: RequestHandler = async (req, res) => {
  try {
    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un centro",
        code: "UNAUTHORIZED",
      });
    }

    const data = req.body as Omit<CreateCenterInput, "ipsId">;

    const payload = {
      ...data,
      ipsId: req.ipsId!,
    };

    const center = await centerService.createCenter(payload);
    res.status(200).json({ data: center });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getCurrentCenter: RequestHandler = async (req, res) => {
  try {
    if (!req.user?.centerId) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes un centro asignado",
        code: "CENTER_NOT_FOUND",
      });
    }

    const center = await centerService.getCurrentCenter({
      centerId: req.user?.centerId!,
    });
    res.status(HTTPStatusCode.OK).json({ data: center });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getCentersById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await centerService.getCenterById({ id });
    res.status(HTTPStatusCode.OK).json({ data: center });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getCenters: RequestHandler = async (req, res) => {
  try {
    const centers = await centerService.getCenters({ ipsId: req.ipsId! });

    res.status(200).json({ data: centers });
  } catch (error) {
    res.status(400).json(error);
  }
};
