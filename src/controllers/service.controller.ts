import ServicesService from "@/services/service/services.service";
import { RequestHandler } from "express";
import { RequestError } from "@/utils/errorHandler";
import HTTPStatusCode from "@/config/httpStatusCode";
import { CreateServiceParams } from "@/services/service/type";
import { UnauthorizedError } from "@/utils/unauthorizedError";

export const createService: RequestHandler = async (req, res) => {
  try {
    if (!req.isSuperAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Forbidden,
        message: "No tienes permiso para crear un servicio",
        code: "FORBIDDEN",
      });
    }
    const data = req.body as Omit<CreateServiceParams, "ipsId">;
    const service = await ServicesService.createService({
      ...data,
      ipsId: req.ipsId!,
    });
    res.status(201).json({ data: service });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getServices: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.ipsId!;

    const services = req.isSuperAdmin
      ? await ServicesService.getServices({ ipsId })
      : await ServicesService.getCenterService({
          ipsId,
          centerId: req.user?.centerId!,
        });
    res.status(200).json({ data: services });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateService: RequestHandler = async (req, res) => {
  try {
    if (req.user!.role === "USER") {
      throw UnauthorizedError;
    }
    const service = ServicesService.updateService;
    res.status(HTTPStatusCode.OK).json({ data: service });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const updateState: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    if (req.user!.role === "USER") {
      throw UnauthorizedError;
    }

    const service = await ServicesService.updateState(id, state);
    res.status(HTTPStatusCode.OK).json({
      data: service.state === 1 ? "Servicio Activado" : "Servicio Inactivado",
    });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};
