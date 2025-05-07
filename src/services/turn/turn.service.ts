import { prisma } from "@/utils/db";
import { Prisma } from "@prisma/client";

class TurnService {
  public async createTurn(data: Prisma.TurnUncheckedCreateInput) {
    const turn = await prisma.turn.create({ data });
    return turn;
  }
}

export default new TurnService();
