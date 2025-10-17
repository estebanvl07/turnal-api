import { Request, Response } from "express";
import AuthService from "@/services/auth/auth.service";

import type {
  LoginUserPayload,
  RegisterUserPayload,
} from "@/services/auth/types";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as RegisterUserPayload;
    const user = await AuthService.signUp(data);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as LoginUserPayload;
    const user = await AuthService.signIn(data);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json(error);
  }
};
