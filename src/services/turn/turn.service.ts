import HTTPStatusCode from "@/config/httpStatusCode";
import { generateTurnCode } from "@/utils/buildCode";
import { prisma } from "@/utils/db";
import { RequestError } from "@/utils/errorHandler";

import { Prisma } from "@prisma/client";

class TurnService {
  /**
   * Crea un turno con el codigo unico para el centro de atencion
   * @param data
   * @returns
   */
  public async createTurn(data: Omit<Prisma.TurnUncheckedCreateInput, "code">) {
    const { placesOfCareId, ...rest } = data;

    /**
     * Busca el lugar de atencion relacionado y su centro de atencion
     * de servicio para obtener el prefijo
     */
    const placeOfCare = await prisma.placesOfCare.findUnique({
      where: { id: placesOfCareId },
      include: { centerService: true },
    });

    if (!placeOfCare) {
      throw new RequestError({
        status: HTTPStatusCode.BadRequest,
        message: "No se encontro el lugar de atencion",
        code: "PLACE_NOT_FOUND",
      });
    }

    /**
     * Obtiene el prefijo del centro de atencion de servicio
     */
    const { prefix, careCenterId } = placeOfCare.centerService;

    /**
     * Crea un objeto con la fecha actual y las horas en 0
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /**
     * Cuenta la cantidad de turnos que se han creado hoy
     * en el centro de atencion de servicio
     */
    const count = await prisma.turn.count({
      where: {
        code: { contains: `${prefix}-` },
        createdAt: { gte: today },
      },
    });

    /**
     * Genera el codigo unico para el turno del día
     */
    const code = generateTurnCode(prefix, count + 1);

    /**
     * Crea el turno con el codigo unico
     */
    const turn = await prisma.turn.create({
      data: { ...rest, code, placesOfCareId, careCenterId },
    });
    return turn;
  }

  public async createComment(data: Prisma.TurnCommentsUncheckedCreateInput) {
    const comment = await prisma.turnComments.create({ data });
    return comment;
  }

  public async getTurnById(id: number) {
    const turn = await prisma.turn.findUnique({
      where: { id },
      include: {
        placesOfCare: {
          include: {
            centerService: true,
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
        service: true,
        priority: true,
        status: true,
      },
    });
    return turn;
  }

  public async getTurns(params: { ipsId: string; centerId?: string }) {
    const { ipsId, centerId } = params;

    const centersTurn = await prisma.careCenter.findMany({
      where: { ipsId, id: centerId },
      include: {
        placesOfCare: {
          include: {
            centerService: true,
            user: true,
          },
        },
        turns: {
          include: {
            placesOfCare: {
              include: {
                centerService: true,
                user: true,
              },
            },
            service: true,
            priority: true,
            status: true,
          },
        },
      },
    });

    const turns = centersTurn.map((center) => ({
      centerId: center.id,
      name: center.name,
      turns: center.turns,
    }));
    return turns;
  }

  public async updateStateTurn(data: { id: number; state: number }) {
    const { id, state } = data;

    const turn = await prisma.turn.update({
      where: { id },
      data: {
        statusId: Number(state),
      },
      include: {
        placesOfCare: {
          include: {
            centerService: true,
            user: true,
          },
        },
        service: true,
        priority: true,
        status: true,
      },
    });
    return turn;
  }
}

export default new TurnService();
