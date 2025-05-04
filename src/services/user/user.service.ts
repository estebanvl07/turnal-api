import { UserIncludes } from "@/types/user.types";
import { prisma } from "@/utils/db";
import { RepositoryError } from "@/utils/errorHandler";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  ipsId: string;
  centerId?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  public userMapper(user: UserIncludes): UserResponse {
    const { id, email, name, ipsId, centerId, role, createdAt, updatedAt } =
      user;

    return {
      id,
      email,
      name,
      ipsId,
      centerId,
      role,
      createdAt,
      updatedAt,
    };
  }

  public async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new RepositoryError({
          message: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        });
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
