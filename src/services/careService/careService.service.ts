import { prisma } from "@/utils/db";

class CareService {
  private generateRandomPrefix() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let prefix = "";
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      prefix += characters.charAt(randomIndex);
    }
    return prefix;
  }

  private async getPrefix(serviceId: string) {
    const prefix = await prisma.services.findUnique({
      where: {
        id: serviceId,
      },
      select: {
        id: true,
        prefix: true,
      },
    });

    return prefix;
  }

  public async addServiceToCareCenter({
    centerId,
    servicesId,
  }: {
    centerId: string;
    servicesId: string[];
  }) {
    try {
      // Buscamos si el servicio ya tiene un prefijo
      const prefix = await Promise.all(
        servicesId.map((serviceId) => this.getPrefix(serviceId))
      );

      // Buscamos si tiene servicios asignados
      const careServicesFound = await prisma.careCenterServices.findMany({
        where: {
          careCenterId: centerId,
          serviceId: {
            in: servicesId,
          },
        },
      });

      // Buscamos los servicios que no estan asignados
      const servicesNotCreateds = servicesId.filter(
        (serviceId) =>
          !careServicesFound.some(
            (careService) => careService.serviceId === serviceId
          )
      );

      // Generamos un prefijo aleatorio si no tiene y si tiene se le asigna el prefijo del servicio
      const manyData = servicesNotCreateds.map((serviceId) => ({
        careCenterId: centerId,
        serviceId,
        prefix:
          prefix && prefix.length > 0
            ? (prefix.find((prefix) => prefix!.id === serviceId)
                ?.prefix as string)
            : this.generateRandomPrefix(),
      }));

      const response = await prisma.careCenterServices.createMany({
        data: manyData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public getCareServicesByCenter({ centerId }: { centerId: string }) {
    try {
      const careServices = prisma.careCenterServices.findMany({
        where: {
          careCenterId: centerId,
        },
        include: {
          careCenter: true,
          service: true,
        },
      });
      return careServices;
    } catch (error) {
      throw error;
    }
  }

  public getCareServiceById(id: string) {
    try {
      const careService = prisma.careCenterServices.findUnique({
        where: {
          id,
        },
        include: {
          careCenter: true,
          service: true,
        },
      });
      return careService;
    } catch (error) {
      throw error;
    }
  }
}

export default new CareService();
