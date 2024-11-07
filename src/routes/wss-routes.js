import {
  checkPendingMessages,
  handleChatMessage,
  updateMessageStatus,
} from "../controllers/chat-controller.js";
import {
  handleVendorLocation,
  registerVendor,
  removeVendor,
  sendVendorList,
} from "../controllers/location-controller.js";
import { parseMessage } from "../utils/websocket-utils.js";

export const handleMessages = (ws, message, wss) => {
  const data = parseMessage(message);

  if (!data) return;

  switch (data.type) {
    case "handshake":
      if (data.role == "vendor") {
        registerVendor(ws, data);
      } else if (data.role == "user") {
        ws.role = "user";
        sendVendorList(ws);
      }
      checkPendingMessages(ws);
      break;
    case "locationUpdate":
      handleVendorLocation(ws, data, wss);
      break;
    case "stopSharing":
      removeVendor(data.username, wss);
      break;
    case "chatMessage":
      handleChatMessage(ws, data, wss);
      break;
    case "messageRead":
      updateMessageStatus(data);
      break;
    default:
      console.log("Unknown message type");
  }
};
