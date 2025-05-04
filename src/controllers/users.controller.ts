import { Prisma } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import UserService from "@/services/user/user.service";

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const createUser = (req: Request, res: Response) => {
  const { name, email, password, ipsName, phone, nit } = req.body;
};
