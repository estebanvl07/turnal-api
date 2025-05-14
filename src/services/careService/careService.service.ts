import { prisma } from "@/utils/db";

class CareService {
  public getCareServicesByCenter({ centerId }: { centerId: string }) {
    try {
      const careServices = prisma.careCenterServices.findMany({
        where: {
          careCenterId: centerId,
        },
        include: {
          careCenter: true,
          placesOfCare: true,
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
          placesOfCare: true,
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
