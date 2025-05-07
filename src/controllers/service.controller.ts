import servicesService from "@/services/service/services.service";
import { RequestHandler } from "express";
import { RequestError } from "@/utils/errorHandler";
import HTTPStatusCode from "@/config/httpStatusCode";
import { CreateServiceParams } from "@/services/service/type";

export const createService: RequestHandler = async (req, res) => {
  try {
    if (!req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un servicio",
        code: "UNAUTHORIZED",
      });
    }
    const data = req.body as Omit<CreateServiceParams, "ipsId">;
    const service = await servicesService.createService({
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

    const services = await servicesService.getServices({ ipsId });
    res.status(200).json({ data: services });
  } catch (error) {
    res.status(400).json(error);
  }
};
