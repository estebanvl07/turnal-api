import { Server as SocketIoServer, type Server } from "socket.io";
import http from "http";

let io: Server;

export const initWebSocketServer = (expressServer: http.Server) => {
  io = new SocketIoServer(expressServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

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
