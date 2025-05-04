import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class ServicesService {
  constructor() {}

  public async createService(data: Prisma.ServicesUncheckedCreateInput) {
    try {
      const service = await prisma.services.create({
        data,
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
      });
      return services;
    } catch (error) {
      throw error;
    }
  }
}

export default new ServicesService();
