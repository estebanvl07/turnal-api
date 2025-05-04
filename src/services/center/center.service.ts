import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class CenterService {
  public async createCenter(data: Prisma.CareCenterUncheckedCreateInput) {
    try {
      const center = await prisma.careCenter.create({
        data,
      });
      return center;
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
