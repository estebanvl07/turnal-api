import HTTPStatusCode from "@/config/httpStatusCode";
import placesService from "@/services/places/places.service";
import { CreatePlaceInput } from "@/services/places/types";
import { RequestError } from "@/utils/errorHandler";
import { RequestHandler } from "express";

export const getPlaces = () => {};

export const updatePlace: RequestHandler = async (req, res): Promise<any> => {
  try {
    const { name } = req.body as { name: string };
    const { placeId } = req.params;

    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un lugar",
        code: "UNAUTHORIZED",
      });
    }

    const place = await placesService.updatePlace(placeId, { name });
    return res.status(HTTPStatusCode.OK).json({ data: place });
  } catch (error) {
    return res.status(HTTPStatusCode.BadRequest).json(error);
  }
};

export const updatePlaceStatus: RequestHandler = async (
  req,
  res
): Promise<any> => {
  try {
    const { active } = req.body as { active: boolean };
    const { placeId } = req.params;

    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un lugar",
        code: "UNAUTHORIZED",
      });
    }

    const place = await placesService.updatePlaceStatus(placeId, { active });
    return res.status(HTTPStatusCode.OK).json({ data: place });
  } catch (error) {
    return res.status(HTTPStatusCode.BadRequest).json(error);
  }
};

export const createPlace: RequestHandler = async (req, res): Promise<any> => {
  try {
    const body = req.body as CreatePlaceInput;
    const user = req.user;

    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un lugar",
        code: "UNAUTHORIZED",
      });
    }

    const payload = {
      ...body,
      centerId: req.isAdmin ? req.user?.centerId! : body.centerId,
    };

    const place = await placesService.createPlace(payload);
    return res.status(HTTPStatusCode.OK).json({ data: place });
  } catch (error) {
    return res.status(HTTPStatusCode.BadRequest).json(error);
  }
};

export const assignUser: RequestHandler = async (req, res): Promise<any> => {
  try {
    const { placeId } = req.params;
    const body = req.body as { userId: string };

    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para asignar un usuario",
        code: "UNAUTHORIZED",
      });
    }

    const place = await placesService.assignUser(placeId, body.userId);
    return res.status(HTTPStatusCode.OK).json({ data: place });
  } catch (error) {
    if (error instanceof RequestError) {
      return res.status(error.HttpStatusCode).json(error);
    }
    return res.status(HTTPStatusCode.BadRequest).json(error);
  }
};

export const assignService: RequestHandler = async (req, res): Promise<any> => {
  try {
    const { placeId } = req.params;
    const body = req.body as { serviceId: string[] };

    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para asignar un servicio",
        code: "UNAUTHORIZED",
      });
    }

    const place = await placesService.assignService(placeId, body.serviceId);
    return res.status(HTTPStatusCode.OK).json({ data: place });
  } catch (error) {
    if (error instanceof RequestError) {
      return res.status(error.HttpStatusCode).json(error);
    }
    return res.status(HTTPStatusCode.BadRequest).json(error);
  }
};
