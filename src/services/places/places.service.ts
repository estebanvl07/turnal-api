import { prisma } from "@/utils/db";
import { CreatePlaceInput } from "./types";
import centerService from "../center/center.service";
import { Prisma } from "@prisma/client";

class PlacesService {
  /**
   * Crea un lugar de atencion
   * @param payload objeto con la informacion del lugar de atencion
   * @returns objeto con la informacion del lugar de atencion
   */
  public async createPlace(payload: CreatePlaceInput) {
    try {
      /**
       * Extrae el nombre y el prefijo del lugar de atencion
       * y los separa en un array
       */
      const { ...data } = payload;

      const name = data.name.split(",");

      /**
       * Crea un array de objetos con la informacion
       * del lugar de atencion, con el nombre y el prefijo
       * separados
       */
      const createPlacesByName = name.map((name) => {
        return {
          name,
          centerId: data.centerId!,
        };
      });

      /**
       * Crea un set de nombres de lugares de atencion unicos
       */
      const uniquePlaces = new Set(
        createPlacesByName.map((place) => place.name)
      );

      /**
       * Crea un array de objetos con la informacion
       * del lugar de atencion, con el nombre y el prefijo
       * separados y los crea en la base de datos
       */
      const manyPlaces: Prisma.PlacesOfCareUncheckedCreateInput[] = Array.from(
        uniquePlaces
      ).map((name) => ({
        name,
        centerId: data.centerId!,
        services: data.servicesId
          ? {
              createMany: {
                data:
                  data.servicesId?.map((serviceId) => ({
                    serviceId,
                  })) ?? [],
              },
            }
          : undefined,
      }));

      const places = await prisma.placesOfCare.createMany({
        data: manyPlaces,
      });

      return places;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async assignUser(placeId: string, userId: string) {
    try {
      const placeUser = await prisma.placesOfCare.update({
        where: {
          id: placeId,
        },
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          services: true,
          user: true,
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
      });

      return placeUser;
    } catch (error) {
      throw error;
    }
  }

  public async assignService(placeId: string, serviceId: string[]) {
    try {
      const placesServicesData = serviceId.map((serviceId) => ({
        placeOfCareId: placeId,
        serviceId,
      }));

      const placeService = await prisma.placeOfCareServices.createMany({
        data: placesServicesData,
      });

      return placeService;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new PlacesService();
