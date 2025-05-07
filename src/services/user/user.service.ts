import { UserIncludes } from "@/types/prisma-types";
import { prisma } from "@/utils/db";
import { RepositoryError } from "@/utils/errorHandler";
import { Prisma } from "@prisma/client";

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

  public async getUserIpsId(id: string) {
    try {
      const user = await prisma.user.findMany({
        where: {
          ipsId: id,
        },
        include: {
          center: true,
          placeOfCare: {
            include: {
              turns: true,
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

  public async createUser(data: Prisma.UserUncheckedCreateInput) {
    try {
      const user = await prisma.user.create({
        data,
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
}

export default new UserService();
