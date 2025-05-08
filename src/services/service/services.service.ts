import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";
import { CreateServiceParams } from "./type";

class ServicesService {
  constructor() {}

  public async createService(data: CreateServiceParams) {
    try {
      const service = await prisma.services.create({
        data: {
          name: data.name,
          icon: data.icon ?? "Heart",
          ipsId: data.ipsId,
          careCenterServices: {
            createMany: {
              data: data.centers.split(",").map((center) => ({
                careCenterId: center,
                prefix: data.prefix,
              })),
            },
          },
        },
        include: {
          careCenterServices: true,
        },
      });

      return service;
    } catch (error) {
      throw error;
    }
  }
  public async getServiceById({ id }: { id: string }) {
    try {
      const service = await prisma.services.findUnique({
        where: {
          id,
        },
      });
      return service;
    } catch (error) {
      throw error;
    }
  }
  public async getServices({ ipsId }: { ipsId: string }) {
    try {
      const services = await prisma.services.findMany({
        where: {
          ipsId,
        },
        include: {
          ips: true,
          _count: {
            select: {
              turns: true,
            },
          },
        },
      });
      const [turnCount, turnSuccess, turnPending, turnCancel] =
        await Promise.all([
          prisma.turn.count({ where: { ipsId } }),
          prisma.turn.count({ where: { ipsId, statusId: 1 } }),
          prisma.turn.count({ where: { ipsId, statusId: 2 } }),
          prisma.turn.count({ where: { ipsId, statusId: 3 } }),
        ]);

      return {
        services,
        statistics: {
          turnCount,
          turnSuccess,
          turnPending,
          turnCancel,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ServicesService();
