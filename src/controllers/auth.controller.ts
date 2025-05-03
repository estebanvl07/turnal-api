import { Request, Response } from "express";
import AuthService from "@/services/auth/auth.service";

import type {
  LoginUserPayload,
  RegisterUserPayload,
} from "@/services/auth/types";

export const registerUser = async (req: Request, res: Response) => {
  const data = req.body as RegisterUserPayload;
  const user = await AuthService.signUp(data);
  res.status(200).json(user);
};

export const loginUser = async (req: Request, res: Response) => {
  const data = req.body as LoginUserPayload;
  const user = await AuthService.signIn(data);
  res.status(200).json(user);
};
