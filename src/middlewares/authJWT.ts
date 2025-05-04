import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/environments";
import HTTPStatusCode from "@/config/httpStatusCode";
import usersService from "@/services/user/user.service";
import { RequestError } from "@/utils/errorHandler";
import { DataStoredInToken } from "@/services/auth/types";
import { prisma } from "@/utils/db";
import { UserIncludes } from "@/types/user.types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  namespace Express {
    interface Request {
      user?: UserIncludes;
      ipsId?: string;
      isAuthenticated?: boolean;
      isAdmin?: boolean;
    }
  }
}

export const authJWT: RequestHandler = async (req, res, next) => {
  try {
    const authorization =
      (req.cookies && req.cookies["Authorization"]) ||
      (req.header("Authorization") ? req.header("Authorization") : null);

    if (authorization) {
      const verificationResponse = jwt.verify(
        authorization,
        JWT_SECRET
      ) as DataStoredInToken;
      const userId = verificationResponse.userId;
      const foundUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (foundUser) {
        req.user = foundUser;
        req.isAuthenticated = true;
        req.isAdmin = foundUser.role === "SUPERADMIN";
        req.ipsId = foundUser.ipsId;
        next();
      } else {
        next(
          new RequestError({
            status: HTTPStatusCode.Unauthorized,
            message: "Error en el token de autorización",
            code: "USER_NOT_FOUND",
          })
        );
      }
    } else {
      next(
        new RequestError({
          status: HTTPStatusCode.NotFound,
          message: "Token de autorización faltante",
          code: "MISSING_AUTH_HEADER",
        })
      );
    }
  } catch (error) {
    next(
      new RequestError({
        status: HTTPStatusCode.Unauthorized,
        message: "ERROR_TOKEN",
        code: "INVALID_JWT_TOKEN",
      })
    );
  }
};
