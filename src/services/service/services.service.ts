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
      return services;
    } catch (error) {
      throw error;
    }
  }
}

export default new ServicesService();
