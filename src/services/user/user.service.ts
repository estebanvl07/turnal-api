import { UserIncludes } from "@/types/prisma-types";
import { hashPassword } from "@/utils/bcrypt";
import { prisma } from "@/utils/db";
import { RepositoryError } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";
import TurnService from "../turn/turn.service";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  ipsId: string;
  centerId?: string | null;
  role: string;
  state: number;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {

  public userMapper(user: UserIncludes): UserResponse {
    const {
      id,
      email,
      name,
      ipsId,
      centerId,
      role,
      createdAt,
      updatedAt,
      state,
    } = user;

    return {
      id,
      email,
      name,
      ipsId,
      centerId,
      role,
      state,
      createdAt,
      updatedAt,
    };
  }

  public async getUserIpsId(id: string, centerId?: string) {
    try {
      const user = await prisma.user.findMany({
        where: {
          ipsId: id,
          centerId,
        },
        include: {
          center: true,
          placeOfCare: {
            include: {
              turns: true,
              _count: {
                select: {
                  turns: {
                    where: {
                      statusId: 1,
                      NOT: await TurnService.validateTurnNoFinished(),
                    },
                  },
                },
              },
            },
          },
          ips: true,
          comments: true,
        },
      });

      if (!user) {
        throw new RepositoryError({
          message: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      const userFound = user.map(
        ({ ips, center, comments, placeOfCare, ...user }) => {
          return {
            ...this.userMapper(user),
            ips,
            center,
            comments,
            placeOfCare,
          };
        }
      );

      return userFound;
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          center: true,
          placeOfCare: true,
          ips: true,
        },
      });

      if (!user) {
        throw new RepositoryError({
          message: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      const { center, placeOfCare, ips, ...userData } = user

      return {
        ...this.userMapper(userData),
        center,
        placeOfCare,
        ips,
      };
    } catch (error) {
      throw error;
    }
  }

  public async createUser(data: Prisma.UserUncheckedCreateInput) {
    try {
      const { password, ...rest } = data;

      const hashedPassword = hashPassword(password);

      const user = await prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
        },
        include: {
          center: true,
          placeOfCare: true,
          ips: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async changeCenter(userId: string, centerId: string) {
    try {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          centerId,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async changePlace(userId: string, placeOfCareId: string) {
    try {
      const user = await prisma.placesOfCare.update({
        where: {
          id: placeOfCareId,
        },
        data: {
          userId,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async UpdateUser(
    userId: string,
    data: Prisma.UserUncheckedUpdateInput
  ) {
    try {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async changeState(id: string, state: number) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          state,
        },
      });

      if (user.state === 2) {
        // si el usuario tenia algun lugar asignado lo quita
        await prisma.placesOfCare.updateMany({
          where: { userId: user.id },
          data: { userId: null },
        });

        // si el usuario tenia turnos asignados en estado pendiente, lo retira
        await prisma.turn.updateMany({
          where: { statusId: 1, userId: user.id },
          data: {
            userId: null,
          },
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
