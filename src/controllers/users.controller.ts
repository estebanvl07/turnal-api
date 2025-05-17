import { Request, RequestHandler, Response } from "express";
import UserService from "@/services/user/user.service";
import HTTPStatusCode from "@/config/httpStatusCode";
import { RequestError } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";

export interface CreateMemberBody {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  centerId: string;
}

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.user?.ipsId;
    if (!req.isSuperAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para obtener todos usuarios",
        code: "UNAUTHORIZED",
      });
    }
    const users = await UserService.getUserIpsId(ipsId!);
    res.status(HTTPStatusCode.OK).json({ data: users });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para crear un usuario",
        code: "UNAUTHORIZED",
      });
    }

    const payload = {
      ...req.body,
      ipsId: req.ipsId!,
    } as Prisma.UserUncheckedCreateInput;

    const user = await UserService.createUser(payload);
    res.status(HTTPStatusCode.OK).json({ data: user });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const getUsersByCenterId: RequestHandler = async (req, res) => {
  try {
    const centerId = req.params.centerId;
    const ipsId = req.user?.ipsId;

    const users = await UserService.getUserIpsId(ipsId!, centerId);
    res.status(HTTPStatusCode.OK).json({ data: users });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const changeCenter: RequestHandler = async (req, res) => {
  try {
    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para cambiar la sede de un usuario",
        code: "UNAUTHORIZED",
      });
    }

    const { userId, centerId } = req.params;

    const user = await UserService.changeCenter(userId, centerId);
    res.status(HTTPStatusCode.OK).json({ data: user });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const changePlace: RequestHandler = async (req, res) => {
  try {
    if (!req.isSuperAdmin && !req.isAdmin) {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para cambiar el lugar de un usuario",
        code: "UNAUTHORIZED",
      });
    }

    const { userId, placeOfCareId } = req.params;

    const user = await UserService.changePlace(userId, placeOfCareId);
    res.status(HTTPStatusCode.OK).json({ data: user });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.user!.role === "USER") {
      throw new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "No tienes permiso para editar el usuario",
        code: "UNAUTHORIZED",
      });
    }

    const user = await UserService.UpdateUser(id, data);
    res.status(HTTPStatusCode.OK).json({ data: user });
  } catch (error) {
    if (error instanceof RequestError) {
      res.status(error.HttpStatusCode).json(error);
    } else {
      res.status(HTTPStatusCode.BadRequest).json(error);
    }
  }
};
