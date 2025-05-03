import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
  res.send("Joel Viloria");
};

export const createUser = (req: Request, res: Response) => {
  const { name, email, password, ipsName, phone, nit } = req.body;
};
