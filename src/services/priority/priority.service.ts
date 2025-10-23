import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class PriorityService {
  public async getPriorityByCenterId(centerId: string) {
    try {
      const priority = await prisma.priority.findMany({
        where: {
          centerId,
        },
        include: {
          center: true,
        },
      });
      return priority;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async updatePriority(
    id: number,
    payload: Prisma.PriorityUncheckedUpdateInput
  ) {
    try {
      const priority = await prisma.priority.update({
        data: payload,
        where: { id },
      });
      return priority;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async createPriority(payload: Prisma.PriorityUncheckedCreateInput) {
    try {
      const priority = await prisma.priority.create({ data: payload });
      return priority;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new PriorityService();
