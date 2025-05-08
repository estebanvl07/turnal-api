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
     * Filtra los prefix para que no se repitan
     * y crea un set de prefix unicos
     */
    const seen = new Set();
    const uniqueCenterServices = places.filter(({ prefix }) => {
      if (seen.has(prefix)) return false;
      seen.add(prefix);
      return true;
    });

    /**
     * Crea un centro de atencion y
     * sus respectivos centros de atencion de servicio
     * en una sola transaccion
     */
    return prisma.$transaction(async (prisma) => {
      const center = await prisma.careCenter.create({
        data: centerData,
      });

      /**
       * Crea los centros de atencion de servicio
       * y les asigna el id del centro de atencion
       * recien creado
       */
      const createdCenterServices = await Promise.all(
        uniqueCenterServices.map(({ serviceId, prefix }) =>
          prisma.careCenterServices.create({
            data: {
              careCenterId: center.id,
              serviceId,
              prefix,
            },
          })
        )
      );

      /**
       * Crea los lugares de atencion
       * y les asigna el id del centro de atencion de servicio
       * recien creado
       */
      const manyPlacesOfCare = createdCenterServices.map((cs, idx) => ({
        name: places[idx].name,
        centerServiceId: cs.id,
        centerId: center.id,
      }));

      await prisma.placesOfCare.createMany({
        data: manyPlacesOfCare,
      });

      return center;
    });
  }

  public async getCenters({ ipsId }: { ipsId: string }) {
    try {
      const centers = await prisma.careCenter.findMany({
        where: {
          ipsId,
        },
      });

      const ips = await prisma.ips.findUnique({
        where: {
          id: ipsId,
        },
      });

      return {
        ips,
        centers,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getCenterById({ id }: { id: string }) {
    try {
      const center = await prisma.careCenter.findUnique({
        where: {
          id,
        },
      });
      return center;
    } catch (error) {
      throw error;
    }
  }
}

export default new CenterService();
