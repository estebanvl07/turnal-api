import HTTPStatusCode from "@/config/httpStatusCode";
import placesService from "@/services/places/places.service";
import { CreatePlaceInput } from "@/services/places/types";
import { RequestError } from "@/utils/errorHandler";
import { RequestHandler } from "express";

export const getPlaces = () => {};

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
