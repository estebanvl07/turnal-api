import { RequestHandler } from "express";
import UserService from "@/services/user/user.service";

export const getTeam: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.centerId;
    // const user = await UserService.getUserById(req.params.id);
    // res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};
