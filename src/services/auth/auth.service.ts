import { prisma } from "@/utils/db";
import jwt from "jsonwebtoken";

import UserService from "../user/user.service";
import { RepositoryError, RequestError } from "@/utils/errorHandler";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { JWT_SECRET } from "@/config/constants";

import type { LoginUserPayload, RegisterUserPayload } from "./types";
import { UserIncludes } from "@/types/user.types";

const CredentialError = new RepositoryError({
  message: "Usuario o Contraseña incorrectos",
  code: "CREDENTIAL_ERROR",
});

type DataStoredInToken = {
  userId: string;
  ipsId: string;
  centerId?: string;
};

class AuthService {
  public userServices = UserService;

  public async signUp(payload: RegisterUserPayload) {
    try {
      const { name, email, password, ipsName, phone, nit } = payload;

      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        throw new RepositoryError({
          message: "Este email ya existe",
          code: "EMAIL_EXISTS",
        });
      }

      const ipsExists = await prisma.ips.findUnique({
        where: {
          nit,
        },
      });

      if (ipsExists) {
        throw new RepositoryError({
          message: "Esta ips ya existe",
          code: "IPS_EXISTS",
        });
      }

      const hashedPassword = hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "SUPERADMIN",
          ips: {
            connect: {
              name: ipsName,
              nit,
              phone,
            },
          },
        },
      });

      return user;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new RequestError({
          status: 400,
          message: error.message,
          code: error.code,
          payload: error.payload,
        });
      }
    }
  }
  public async signIn(payload: LoginUserPayload) {
    try {
      const { email, password } = payload;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          ips: true,
          center: true,
        },
      });

      if (!user) {
        throw CredentialError;
      }

      const isPasswordValid = comparePassword({
        password,
        hash: user.password,
      });

      if (!isPasswordValid) {
        throw CredentialError;
      }

      const token = this.createToken({
        userId: user.id,
        ipsId: user.ips.id,
        centerId: user.center?.id,
      });

      return {
        user: this.userServices.userMapper(user as unknown as UserIncludes),
        token,
      };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new RequestError({
          status: 400,
          message: error.message,
          code: error.code,
          payload: error.payload,
        });
      }
    }
  }

  public createToken({ userId, ipsId, centerId }: DataStoredInToken): string {
    const dataStoredInToken: DataStoredInToken = { userId, ipsId, centerId };

    return jwt.sign(dataStoredInToken, JWT_SECRET, { expiresIn: "1d" });
  }
}

export default new AuthService();
