import { prisma } from "@/utils/db";
import { RepositoryError } from "@/utils/errorHandler";

class IpsService {
  constructor() {}

  public async getIpsById(id: string) {
    try {
      const ips = await prisma.ips.findUnique({
        where: {
          id,
        },
      });

      if (!ips) {
        throw new RepositoryError({
          message: "Ips no encontrado",
          code: "IPS_NOT_FOUND",
        });
      }

      return ips;
    } catch (error) {
      throw error;
    }
  }
}

export default new IpsService();
