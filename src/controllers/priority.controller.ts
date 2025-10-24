import priorityService from "@/services/priority/priority.service";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const getPriorityByCenterId: RequestHandler = async (req, res) => {
  try {
    const centerId = req.params.centerId;
    const priority = await priorityService.getPriorityByCenterId(centerId);
    console.log(priority);
    res.status(200).json({ data: priority });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener la prioridad" });
  }
};

export const createPriority: RequestHandler = (req, res) => {
  try {
    const payload: Prisma.PriorityUncheckedCreateInput = req.body;

    const priority = priorityService.createPriority(payload);
    res.status(201).json(priority);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la prioridad" });
  }
};

export const updatePriority: RequestHandler = (req, res) => {
  try {
    const payload: Prisma.PriorityUncheckedUpdateInput = req.body;

    const priority = priorityService.updatePriority(
      Number(payload.id),
      payload
    );
    res.status(201).json(priority);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar la prioridad" });
  }
};
