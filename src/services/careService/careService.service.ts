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

  public async getCareServicesByCenter({ centerId }: { centerId: string }) {
    try {
      const careServices = await prisma.careCenterServices.findMany({
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

  public async getCareServiceById(id: string) {
    try {
      const careService = await prisma.careCenterServices.findUnique({
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

  public async removeServiceFromCareCenter({
    centerId,
    serviceId,
  }: {
    centerId: string;
    serviceId: string;
  }) {
    return prisma.$transaction(async (prisma) => {
      // buscamos el servicio dentro del los asignados al centro
      const careService = await prisma.careCenterServices.findMany({
        where: { careCenterId: centerId, serviceId: serviceId },
      });

      if (!careService) {
        // si no se encuentra el servicio, termina
        console.warn(`CareCenterService ${serviceId} no encontrado`);
        return null;
      }

      // buscamos los turnos no finalizados
      const turnsAssociated = await prisma.turn.findMany({
        where: {
          careCenterId: centerId,
          serviceId,
          status: {
            final: false,
          },
          unfinishedTurn: null,
        },
      });

      // limpiamos los turnos no finalizados
      const unfinishedTurns = turnsAssociated.map(async (turn) => {
        await prisma.unfinishedTurn.create({
          data: {
            turnId: turn.id,
            userId: turn.userId,
          },
        });
      });

      await Promise.all(unfinishedTurns);

      // limpiamos los lugares de atencion que tengan ese servicio
      const placesOfCareAssociated = await prisma.placesOfCare.findMany({
        where: {
          centerId,
          services: {
            some: {
              serviceId: serviceId,
            },
          },
        },
      });

      // eliminamos los servicios de los lugares de atencion
      const placesOfCareDeletedServices = placesOfCareAssociated.map(
        async (place) => {
          await prisma.placeOfCareServices.deleteMany({
            where: {
              placeOfCareId: place.id,
              serviceId,
            },
          });
        }
      );

      await Promise.all(placesOfCareDeletedServices);

      // eliminarmos el servicio
      await prisma.careCenterServices.deleteMany({
        where: {
          id: {
            in: careService.map((careService) => careService.id),
          },
        },
      });

      return careService;
    });
  }
}

export default new CareService();
