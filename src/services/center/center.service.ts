import { prisma } from "@/utils/db";
import type { CreateCenterInput } from "./types";
import ServicesService from "../service/services.service";

class CenterService {
  public getServiceById = ServicesService.getServiceById;

  /**
   * Crea un centro de atencion y sus respectivos centros de atencion de servicio
   * @param data
   * @returns
   */
  public async createCenter(data: CreateCenterInput) {
    const { places, ...centerData } = data;

    /**
     * Crea un centro de atencion y
     * sus respectivos lugares de atencion
     * en una sola transaccion
     */
    return prisma.$transaction(async (prisma) => {
      const center = await prisma.careCenter.create({
        data: centerData,
      });

      const manyPlacesOfCare =
        places === ""
          ? []
          : places.split(",").map((place) => ({
              name: place.trim(),
              centerId: center.id,
            }));

      await prisma.placesOfCare.createMany({
        data: manyPlacesOfCare,
      });

      return await prisma.careCenter.findUnique({
        where: {
          id: center.id,
        },
      });
    });
  }

  public async updateCenter({
    centerId,
    body,
  }: {
    centerId: string;
    body: CreateCenterInput;
  }) {
    const { places, ...centerData } = body;

    try {
      // Actualiza los datos del centro de atencion,
      // los places que envien serán agregados como nuevos lugares de atencion
      return prisma.$transaction(async (prisma) => {
        const center = await prisma.careCenter.update({
          where: {
            id: centerId,
          },
          data: centerData,
        });

        const manyPlacesOfCare =
          places === ""
            ? []
            : places.split(",").map((place) => ({
                name: place.trim(),
                centerId: center.id,
              }));

        await prisma.placesOfCare.createMany({
          data: manyPlacesOfCare,
        });

        return await prisma.careCenter.findUnique({
          where: {
            id: center.id,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  public async getCenters({ ipsId }: { ipsId: string }) {
    try {
      const centers = await prisma.careCenter.findMany({
        where: {
          ipsId,
        },
        include: {
          ips: true,
          placesOfCare: {
            include: {
              user: true,
              services: true,
            },
          },
          centerServices: {
            include: {
              service: true,
            },
          },
        },
      });

      return centers;
    } catch (error) {
      throw error;
    }
  }

  public async getCurrentCenter({ centerId }: { centerId: string }) {
    try {
      const center = await prisma.careCenter.findFirst({
        where: {
          id: centerId,
        },
      });
      return center;
    } catch (error) {
      throw error;
    }
  }

  public async getCenterById({ id }: { id: string }) {
    try {
      const center = await prisma.careCenter.findFirst({
        where: {
          id,
        },
        include: {
          centerServices: {
            include: {
              service: true,
            },
          },
          placesOfCare: {
            include: {
              user: true,
              services: {
                include: {
                  service: {
                    include: {
                      service: true,
                    },
                  },
                },
              },
              center: {
                include: {
                  centerServices: {
                    include: {
                      service: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return center;
    } catch (error) {
      throw error;
    }
  }

  public async getTurnsByCenter({
    id,
    start_date,
    end_date,
    statusId,
    serviceId,
    identification,
  }: {
    id: string;
    start_date: string;
    end_date: string;
    statusId?: number;
    serviceId?: string;
    identification?: string;
  }) {
    console.log(id, start_date, end_date, statusId, serviceId);

    try {
      const turns = await prisma.turn.findMany({
        where: {
          careCenterId: id,
          date: {
            gte: start_date,
            lte: end_date,
          },
          statusId,
          serviceId,
          identification,
        },
        include: {
          service: true,
          status: true,
          placesOfCare: true,
          careCenter: true,
        },
      });

      return turns;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new CenterService();
