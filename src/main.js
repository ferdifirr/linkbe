import { web } from "./app/web.js";
import { WebSocketServer } from "ws";
import { logger } from "./app/logging.js";
import { handleMessages } from "./routes/wss-routes.js";
import "dotenv/config";
import { handleDisconnect } from "./controllers/location-controller.js";

const env = process.env;

const server = web.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  logger.info("Client connected");

  ws.on("message", (message) => {
    handleMessages(ws, message, wss);
  });

  ws.on("close", () => {
    handleDisconnect(ws, wss);
    logger.info("Client disconnected");
  });
});
