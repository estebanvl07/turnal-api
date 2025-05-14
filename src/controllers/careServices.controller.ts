import { RequestHandler } from "express";
import careServiceService from "@/services/careService/careService.service";
import { RequestError } from "@/utils/errorHandler";
import HTTPStatusCode from "@/config/httpStatusCode";

export const getCareServices: RequestHandler = (req, res) => {
  try {
    const centerId = req.isSuperAdmin
      ? req.params.centerId
      : req.user?.centerId!;

    const careServices = careServiceService.getCareServicesByCenter({
      centerId,
    });
    res.status(HTTPStatusCode.OK).json({ data: careServices });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getCareServicesById: RequestHandler = (req, res) => {
  try {
    const id = req.params.id;
    const careService = careServiceService.getCareServiceById(id);
    res.status(HTTPStatusCode.OK).json({ data: careService });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};
