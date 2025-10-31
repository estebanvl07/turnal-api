import HTTPStatusCode from "@/config/httpStatusCode";
import { generateTurnCode } from "@/utils/buildCode";
import { prisma } from "@/utils/db";
import { RequestError } from "@/utils/errorHandler";
import { Turn, Prisma } from "@prisma/client";
import { getCenterChannel, getIo } from "@/utils/websocket";

class TurnService {
  public async validateTurnNoFinished() {
    return [
      {
        id: {
          in: await prisma.finishedTurn
            .findMany({
              select: {
                turnId: true,
              },
            })
            .then((turns) => turns.map((turn) => turn.turnId)),
        },
      },
      {
        id: {
          in: await prisma.unfinishedTurn
            .findMany({
              select: {
                turnId: true,
              },
            })
            .then((turns) => turns.map((turn) => turn.turnId)),
        },
      },
    ];
  }

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
              finishedTurn: {
                id: {
                  not: undefined,
                },
              },
            },
          });
          return {
            placeId: place.placeOfCareId,
            count,
          };
        });

        if (counts.length === 0) {
          throw new RequestError({
            status: HTTPStatusCode.BadRequest,
            message: "No se encontro lugar de atencion con el servicio",
            code: "PLACE_OF_CARE_NOT_FOUND",
          });
        }

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
          placesOfCare: {
            include: {
              user: true,
            },
          },
          service: true,
          status: true,
        },
      });

      await this.createStoryTurn(turn.id, initialStatus.id);

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

  public async updateTurnById(
    id: number,
    data: Prisma.TurnUncheckedUpdateInput
  ) {
    const oldTurn = await prisma.turn.findUnique({
      where: { id },
    });

    const turn = await prisma.turn.update({
      where: { id },
      data,
    });

    if (data.statusId !== oldTurn?.statusId) {
      await this.createStoryTurn(id, data.statusId as number);
    }

    return turn;
  }

  public async createComment(data: Prisma.TurnCommentsUncheckedCreateInput) {
    const comment = await prisma.turnComments.create({ data });
    return comment;
  }

  public async getTurnById(id: number) {
    try {
      const turn = await prisma.turn.findUnique({
        where: { id },
        include: {
          unfinishedTurn: {
            include: {
              user: true,
            },
          },
          finishedTurn: {
            include: {
              user: true,
            },
          },
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
          history: {
            include: {
              status: true,
            },
          },
        },
      });

      if (!turn) {
        throw new RequestError({
          status: HTTPStatusCode.NotFound,
          message: "Turno no encontrado",
          code: "TURN_NOT_FOUND",
        });
      }

      return turn;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getTurns(params: { ipsId: string; centerId?: string }) {
    const { ipsId, centerId } = params;

    const centersTurn = await prisma.careCenter.findMany({
      where: {
        ipsId,
        id: centerId,
        turns: {
          some: {
            NOT: await this.validateTurnNoFinished(),
          },
        },
      },
      include: {
        placesOfCare: {
          include: {
            user: true,
          },
        },
        turns: {
          where: {
            NOT: await this.validateTurnNoFinished(),
          },
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
        NOT: await this.validateTurnNoFinished(),
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

  public async updateStateTurn(data: {
    id: number;
    state: number;
    assignMe?: boolean;
    userId?: string;
    placesOfCareId?: string;
  }) {
    const { id, state, assignMe, userId, placesOfCareId } = data;

    let turn;

    if (assignMe) {
      turn = await prisma.turn.update({
        where: { id },
        data: {
          statusId: state,
          userId,
          placesOfCareId,
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
    } else {
      turn = await prisma.turn.update({
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
    }

    const lastStory = await prisma.turnStatusHistory.findFirst({
      where: {
        turnId: id,
      },
      orderBy: {
        enteredAt: "desc",
      },
    });

    if (lastStory && state !== lastStory.statusId) {
      await prisma.turnStatusHistory.update({
        where: {
          id: lastStory.id,
        },
        data: {
          exitedAt: new Date(),
          durationSeconds: Math.floor(
            (new Date().getTime() - lastStory.enteredAt.getTime()) / 1000
          ),
        },
      });

      this.createStoryTurn(id, state);
    }

    const io = getIo();

    // Emitimos el evento a todos los usuarios que están en el canal del centro correspondiente
    io.to(getCenterChannel(turn.placesOfCare.center.id)).emit(
      "turn:statusUpdate",
      {
        turnId: turn.id,
        title: `Turno actualizado`,
        message: `El turno ${turn.code} ha sido actualizado a "${turn.status.name}"`,
        turnData: turn,
      }
    );

    return turn;
  }

  public async updateNextTurn({ id }: { id: number }) {
    const turnFound = await prisma.turn.findUnique({
      where: { id },
      include: {
        status: true,
      },
    });

    if (!turnFound) {
      throw new RequestError({
        status: HTTPStatusCode.NotFound,
        message: "Turno no encontrado",
        code: "TURN_NOT_FOUND",
      });
    }

    const status = turnFound?.status;

    if (status?.final) {
      return;
    }

    const nextStatus = await prisma.turnStatus.findFirst({
      where: {
        order: status?.order + 1,
      },
    });

    const turnUpdated = await prisma.turn.update({
      where: { id },
      data: {
        statusId: nextStatus?.id,
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

    const lastStory = await prisma.turnStatusHistory.findFirst({
      where: {
        turnId: id,
      },
      orderBy: {
        enteredAt: "desc",
      },
    });

    if (lastStory && turnFound.statusId !== lastStory.statusId) {
      await prisma.turnStatusHistory.update({
        where: {
          id: lastStory.id,
        },
        data: {
          exitedAt: new Date(),
          durationSeconds: Math.floor(
            (new Date().getTime() - lastStory.enteredAt.getTime()) / 1000
          ),
        },
      });

      this.createStoryTurn(id, turnFound.statusId);
    }

    const io = getIo();

    // Emitimos el evento a todos los usuarios que están en el canal del centro correspondiente
    io.to(getCenterChannel(turnUpdated.placesOfCare.center.id)).emit(
      "turn:statusUpdate",
      {
        turnId: turnUpdated.id,
        title: `Turno actualizado`,
        message: `El turno ${turnUpdated.code} ha sido actualizado a "${turnUpdated.status.name}"`,
        turnData: turnUpdated,
      }
    );

    return turnUpdated;
  }

  public async getHistoryTurn(turnId: number) {
    try {
      const history = await prisma.turnStatusHistory.findMany({
        where: {
          turnId,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  public async createStoryTurn(turnId: number, state: number) {
    try {
      const story = await prisma.turnStatusHistory.create({
        data: {
          turnId,
          statusId: state,
        },
      });

      return story;
    } catch (error) {
      throw error;
    }
  }

  public async cleanTurns(data: { centerId: string; userId: string }) {
    try {
      const { centerId, userId } = data;
      const unfinishedTurns = await prisma.turn.findMany({
        where: {
          careCenterId: centerId,
          status: {
            final: false,
          },
          NOT: {
            id: {
              in: await prisma.unfinishedTurn
                .findMany({
                  select: {
                    turnId: true,
                  },
                })
                .then((turns) => turns.map((turn) => turn.turnId)),
            },
          },
        },
      });

      const finishedTurns = await prisma.turn.findMany({
        where: {
          careCenterId: centerId,
          status: {
            final: true,
          },
          NOT: {
            id: {
              in: await prisma.finishedTurn
                .findMany({
                  select: {
                    turnId: true,
                  },
                })
                .then((turns) => turns.map((turn) => turn.turnId)),
            },
          },
        },
      });

      const unfinishedTurnsIds = unfinishedTurns.map((turn) => turn.id);
      const finishedTurnsIds = finishedTurns.map((turn) => turn.id);

      await prisma.unfinishedTurn.createMany({
        data: unfinishedTurnsIds.map((turnId) => ({
          turnId,
          userId,
        })),
      });

      await prisma.finishedTurn.createMany({
        data: finishedTurnsIds.map((turnId) => ({
          turnId,
          userId,
        })),
      });

      return {
        unfinishedTurns,
        finishedTurns,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new TurnService();
