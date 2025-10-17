import { Request, RequestHandler, Response } from "express";
import IpsService from "@/services/ips.service";

// obtiene ips del usuario autenticado
export const getIps: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.user!.ipsId;
    const ips = await IpsService.getIpsById(ipsId);
    res.status(200).json({ data: ips });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getIpsCenters: RequestHandler = async (req, res) => {
  try {
    const ipsId = req.user!.ipsId;
    const ips = await IpsService.getIpsById(ipsId);
    res.status(200).json({ data: ips });
  } catch (error) {
    res.status(400).json(error);
  }
};
