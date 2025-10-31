import HTTPStatusCode from "@/config/httpStatusCode";
import { RequestError } from "./errorHandler";

export const UnauthorizedError = new RequestError({
  status: HTTPStatusCode.Forbidden,
  message: "No tienes permiso para realizar esta acción",
  code: "FORBIDDEN",
});
