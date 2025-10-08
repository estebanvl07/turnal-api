import HTTPStatusCode from "@/config/httpStatusCode";
import { generateTurnCode } from "@/utils/buildCode";
import { prisma } from "@/utils/db";
import { RequestError } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";
import { getCenterChannel, getIo } from "@/utils/websocket";

class TurnService {
  /**
   * Crea un turno con el codigo unico para el centro de atencion
   * @param data
   * @returns
   */
  public async createTurn(data: Omit<Prisma.TurnUncheckedCreateInput, "code">) {
    try {
      const { placesOfCareId, careCenterId, userId, ...rest } = data;

      /**
       * Busca el lugar de atencion relacionado y su centro de atencion
       * de servicio para obtener el prefijo
       */
      let placeOfCare;

      // Si no se proporciona el id del lugar de atencion se busca el primer lugar de atencion que atienda el servicio
      if (!placesOfCareId) {
        const serviceOfCenter = await prisma.careCenterServices.findFirst({
          where: {
            serviceId: rest.serviceId,
            careCenterId: careCenterId!,
          },
          select: {
            id: true,
          },
        });

        const placesWithRequiredService =
          await prisma.placeOfCareServices.findMany({
            where: {
              serviceId: serviceOfCenter?.id,
            },
          });

        const counts = placesWithRequiredService.map(async (place) => {
          const count = await prisma.turn.count({
            where: {
              placesOfCareId: place.placeOfCareId,
            },
          });
          return {
            placeId: place.placeOfCareId,
            count,
          };
        });

        const placesWithCount = await Promise.all(counts);

        // Busca el lugar de atencion con menor cantidad de turnos
        const placeWithMinCount = placesWithCount.reduce((prev, current) => {
          return prev.count < current.count ? prev : current;
        });

        placeOfCare = await prisma.placesOfCare.findUnique({
          where: { id: placeWithMinCount.placeId },
        });
      } else {
        placeOfCare = await prisma.placesOfCare.findUnique({
          where: { id: placesOfCareId },
        });
      }

      if (!placeOfCare) {
        throw new RequestError({
          status: HTTPStatusCode.BadRequest,
          message:
            "No se encontro el lugar de atencion, configurelo en el centro de atencion",
          code: "PLACE_OF_CARE_NOT_FOUND",
        });
      }

      const careCenterService = await prisma.careCenterServices.findFirst({
        where: { serviceId: rest.serviceId },
      });

      if (!careCenterService) {
        throw new RequestError({
          status: HTTPStatusCode.BadRequest,
          message: "No se encontro el servicio",
          code: "SERVICE_NOT_FOUND",
        });
      }

      const prefix = careCenterService?.prefix;

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
      const initialStatus = await prisma.turnStatus.findFirst({
        where: {
          careCenterId: careCenterId!,
          isActive: true,
          initial: true,
        },
      });

      if (!initialStatus) {
        throw new RequestError({
          status: HTTPStatusCode.BadRequest,
          message: "No se encontro el estado inicial",
          code: "INITIAL_STATUS_NOT_FOUND",
        });
      }

      /**
       * Crea el turno con el codigo unico
       */
      const turn = await prisma.turn.create({
        data: {
          ...rest,
          code,
          placesOfCareId: placeOfCare?.id,
          careCenterId,
          userId: placeOfCare.userId,
          ipsId: rest.ipsId,
        },
        include: {
          placesOfCare: true,
        },
      });

      const io = getIo();

      // Emitimos el evento a todos los usuarios que están en el canal del centro correspondiente
      io.to(getCenterChannel(careCenterId!)).emit("turn:new", {
        turnId: turn.id,
        title: `Turno creado`,
        message: `El turno ${turn.code} ha sido creado`,
        turnData: turn,
      });

      return turn;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
            center: true,
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
            user: true,
          },
        },
        turns: {
          include: {
            placesOfCare: {
              include: {
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

  public async getTurnsByUser(userId: string) {
    const turns = await prisma.turn.findMany({
      where: {
        placesOfCare: {
          userId,
        },
      },
      include: {
        placesOfCare: {
          include: {
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
            center: true,
            user: true,
          },
        },

        service: true,
        priority: true,
        status: true,
      },
    });

    const io = getIo();

    // Emitimos el evento a todos los usuarios que están en el canal del centro correspondiente
    io.to(getCenterChannel(turn.placesOfCare.center.id)).emit("turn:updated", {
      turnId: turn.id,
      title: `Turno actualizado`,
      message: `El turno ${turn.code} ha sido actualizado a "${turn.status.name}"`,
      turnData: turn,
    });

    if (state === 2) {
      io.to(getCenterChannel(turn.placesOfCare.center.id)).emit("turn:call", {
        turnId: turn.id,
        title: `Turno llamado`,
        message: `El turno ${turn.code} ha sido llamado`,
        turnData: turn,
      });
    }

    if (state === 3) {
      io.to(getCenterChannel(turn.placesOfCare.center.id)).emit(
        "turn:finished",
        {
          turnId: turn.id,
          title: `Turno finalizado`,
          message: `El turno ${turn.code} ha sido finalizado`,
          turnData: turn,
        }
      );
    }
    return turn;
  }
}

export default new TurnService();
