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
