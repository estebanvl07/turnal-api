import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class StatusService {
  public async createStatus(payload: Prisma.TurnStatusUncheckedCreateInput) {
    try {
      const lastStatus = await prisma.turnStatus.findFirst({
        where: { careCenterId: payload.careCenterId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const order = lastStatus ? lastStatus.order + 1 : 1;

      return await prisma.turnStatus.create({ data: { ...payload, order } });
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
        orderBy: {
          order: "asc",
        },
      });
      return status;
    } catch (error) {
      throw error;
    }
  }

  public async updateStatusOrder(status: number[], careCenterId: string) {
    try {
      for (let i = 0; i < status.length; i++) {
        await prisma.turnStatus.update({
          data: { order: i + 1 },
          where: {
            careCenterId,
            id: status[i],
          },
        });
      }
      return await this.getStatus(careCenterId);
    } catch (error) {
      throw error;
    }
  }
}

export default new StatusService();
