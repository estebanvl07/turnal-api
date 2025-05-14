import { prisma } from "@/utils/db";
import { CreatePlaceInput } from "./types";
import centerService from "../center/center.service";
import { Prisma } from "@prisma/client";

class PlacesService {
  public async createPlace(payload: CreatePlaceInput) {
    try {
      const { ...data } = payload;

      const name = data.name.split(",");

      const careCenterServiceFound = await prisma.careCenterServices.findUnique(
        {
          where: {
            careCenterId_prefix: {
              careCenterId: data.centerId!,
              prefix: data.prefix,
            },
          },
        }
      );

      const createPlacesByName = name.map((name) => {
        return {
          name,
          serviceId: data.serviceId!,
          centerId: data.centerId!,
          userId: data.userId,
        };
      });

      const uniquePlaces = new Set(
        createPlacesByName.map((place) => place.name)
      );

      const manyPlaces: Prisma.PlacesOfCareUncheckedCreateInput[] = Array.from(
        uniquePlaces
      ).map((name) => ({
        name,
        centerId: data.centerId!,
        centerServiceId: careCenterServiceFound?.id!,
        userId: data.userId,
      }));

      console.log(manyPlaces);

      const places = await prisma.placesOfCare.createMany({
        data: manyPlaces,
      });

      return places;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new PlacesService();
