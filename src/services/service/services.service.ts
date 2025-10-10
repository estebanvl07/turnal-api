import { prisma } from "@/utils/db";
import { CreateServiceParams } from "./type";
import { Prisma } from "@prisma/client";

class ServicesService {
  constructor() {}

  public async createService(data: CreateServiceParams) {
    try {
      const centers = data.centers === "" ? [] : data.centers.split(",");

      const service = await prisma.services.create({
        data: {
          name: data.name,
          icon: data.icon ?? "Heart",
          ipsId: data.ipsId,
          prefix: data.prefix,
          careCenterServices: {
            createMany: {
              data: centers.map((center) => ({
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
  public async getServiceById({
    id,
    centerId,
  }: {
    id: string;
    centerId?: string;
  }) {
    try {
      const service = await prisma.services.findUnique({
        where: {
          id,
          careCenterServices: {
            some: {
              placeOfCareServices: {
                some: {
                  placeOfCare: {
                    centerId,
                  },
                },
              },
            },
          },
        },
        include: {
          careCenterServices: {
            include: {
              careCenter: true,
              placeOfCareServices: {
                include: {
                  placeOfCare: true,
                },
              },
            },
          },
        },
      });
      return service;
    } catch (error) {
      throw error;
    }
  }
  public async getStatistics({
    ipsId,
    centerId,
  }: {
    ipsId: string;
    centerId?: string;
  }) {
    const [turnCount, turnSuccess, turnPending, turnCancel] = await Promise.all(
      [
        prisma.turn.count({ where: { ipsId, careCenterId: centerId } }),
        prisma.turn.count({
          where: { ipsId, careCenterId: centerId, statusId: 1 },
        }),
        prisma.turn.count({
          where: { ipsId, careCenterId: centerId, statusId: 2 },
        }),
        prisma.turn.count({
          where: { ipsId, careCenterId: centerId, statusId: 3 },
        }),
      ]
    );

    return {
      turnCount,
      turnSuccess,
      turnPending,
      turnCancel,
    };
  }
  public async getServices({ ipsId }: { ipsId: string }) {
    try {
      const services = await prisma.services.findMany({
        where: {
          ipsId,
        },
        include: {
          ips: true,
          careCenterServices: {
            include: {
              careCenter: true,
              placeOfCareServices: {
                include: {
                  placeOfCare: true,
                },
              },
            },
          },
          _count: {
            select: {
              turns: true,
            },
          },
        },
      });

      const statistics = await this.getStatistics({ ipsId });

      return {
        services,
        statistics,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getCenterService({ centerId }: { centerId: string }) {
    try {
      const services = await prisma.services.findMany({
        where: {
          careCenterServices: {
            some: {
              careCenterId: centerId,
            },
          },
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

      const statistics = await this.getStatistics({ ipsId: centerId });

      return {
        services,
        statistics,
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateService(
    id: string,
    data: Prisma.ServicesUncheckedUpdateInput
  ) {
    try {
      const service = await prisma.services.update({
        where: {
          id,
        },
        data,
      });
      return service;
    } catch (error) {
      throw error;
    }
  }

  public async updateState(id: string, state: number) {
    try {
      const service = prisma.services.update({
        where: {
          id,
        },
        data: {
          state,
          careCenterServices: {
            updateMany: {
              where: {
                serviceId: id,
              },
              data: state,
            },
          },
        },
      });
      return service;
    } catch (error) {
      throw error;
    }
  }
}

export default new ServicesService();
