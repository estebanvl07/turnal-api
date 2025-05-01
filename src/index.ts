import http from "http";
import { app } from "./app";
import { initWebSocketServer } from "./utils/websocket";
import { PORT } from "config/constants";

const expressServer = http.createServer(app);
initWebSocketServer(expressServer);

expressServer.listen(PORT, () => {
  console.log(`🚀 Server running on port, ${PORT}`);
});
