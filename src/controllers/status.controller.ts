import { RequestHandler } from "express";
import StatusService from "@/services/status/status.service";
import HTTPStatusCode from "@/config/httpStatusCode";

export const createStatus: RequestHandler = async (req, res) => {
  try {
    const user = req.user;

    if (!user?.centerId) {
      throw Error("No se encontro un centro para asignarle este estado");
    }

    const payload = {
      ...req.body,
      ipsId: user?.ipsId,
      careCenterId: user?.centerId,
    };

    const status = await StatusService.createStatus(payload);
    res.status(HTTPStatusCode.OK).json({ data: status });
  } catch (error) {
    res.status(HTTPStatusCode.InternalServerError).json(error);
  }
};

export const updateStatus: RequestHandler = async (req, res) => {
  try {
    const status = await StatusService.updateStatus(
      Number(req.params.id),
      req.body
    );
    res.status(HTTPStatusCode.OK).json({ data: status });
  } catch (error) {
    res.status(HTTPStatusCode.InternalServerError).json(error);
  }
};

export const deleteStatus: RequestHandler = async (req, res) => {
  try {
    // const status = await StatusService.deleteStatus(Number(req.params.id));
    res.status(HTTPStatusCode.OK).json({ data: "" });
  } catch (error) {
    res.status(HTTPStatusCode.InternalServerError).json(error);
  }
};

export const getStatus: RequestHandler = async (req, res) => {
  try {
    const centerId = req.params.centerId || req.user?.centerId;

    if (!centerId) {
      throw Error("No se encontro un centro para asignarle este estado");
    }

    const status = await StatusService.getStatus(centerId);
    res.status(HTTPStatusCode.OK).json({ data: status });
  } catch (error) {
    res.status(HTTPStatusCode.InternalServerError).json(error);
  }
};

export const updateStatusOrder: RequestHandler = async (req, res) => {
  try {
    const centerId = req.params.centerId || req.user?.centerId;

    if (!centerId) {
      throw Error("No se encontro un centro para asignarle este estado");
    }

    const status = await StatusService.updateStatusOrder(
      req.body.status,
      centerId
    );
    res.status(HTTPStatusCode.OK).json({ data: status });
  } catch (error) {
    res.status(HTTPStatusCode.InternalServerError).json(error);
  }
};
