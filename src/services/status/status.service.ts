import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class StatusService {
  public async createStatus(payload: Prisma.TurnStatusUncheckedCreateInput) {
    try {
      const status = await prisma.turnStatus.create({
        data: {
          name: "fefe",
          initial: false,
          final: false,
          isActive: true,
          ipsId: "",
          careCenterId: "",
        },
      });
      return status;
    } catch (error) {
      throw error;
    }
  }

  public async updateStatus(id: number, payload: Prisma.TurnStatusUpdateInput) {
    try {
      const statusUpdated = await prisma.turnStatus.update({
        data: payload,
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getStatus(careCenterId: string) {
    try {
      const status = await prisma.turnStatus.findMany({
        where: {
          careCenterId,
        },
      });
      return status;
    } catch (error) {
      throw error;
    }
  }
}

export default new StatusService();
