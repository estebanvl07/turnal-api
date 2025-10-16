import { Server as SocketIoServer, type Server } from "socket.io";
import http from "http";

let io: Server;

export const initWebSocketServer = (expressServer: http.Server) => {
  io = new SocketIoServer(expressServer, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Evento cuando un usuario se loguea (con `centerId` y `userId` como ejemplo)
    socket.on("center:join", ({ userId, centerId }) => {
      console.log(`User ${userId} logged in, joining center: ${centerId}`);

      // Asociamos al usuario con el canal de su centro de atención
      socket.join(getCenterChannel(centerId)); // Asignamos al canal con el `centerId`
      console.log(`📍 User ${userId} joined center-${centerId}`);

      // Aquí podrías emitir un mensaje o notificación personalizada para ese usuario o centro
      io.to(getCenterChannel(centerId)).emit("center:join", {
        userId,
        centerId,
        message: `Welcome ${userId}, you've joined center ${centerId}`,
      });
    });

    // Evento de desconexión
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("WebSocket server not initialized");
  }
  return io;
};

export const getCenterChannel = (centerId: string) => {
  return `center-${centerId}`;
};
