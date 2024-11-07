import { broadcastLocation } from "../services/location-service.js";

const activeVendors = new Map();

const registerVendor = (ws, data) => {
  const { username, latitude, longitude } = data;
  ws.role = "vendor";
  activeVendors.set(username, { ws, latitude, longitude });
};

const sendVendorList = (ws) => {
  const vendorList = Array.from(activeVendors.entries()).map(
    ([username, data]) => ({
      username,
      latitude: data.latitude,
      longitude: data.longitude,
    })
  );

  ws.send(JSON.stringify({ type: "vendorList", vendors: vendorList }));
};

const handleVendorLocation = (ws, data, wss) => {
  const { username, latitude, longitude } = data;

  if (activeVendors.has(username)) {
    activeVendors.set(username, { ws, latitude, longitude });
    broadcastLocation(ws, data, wss);
  }
};

const removeVendor = (username, wss) => {
  activeVendors.delete(username);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN && client.role === "user") {
      client.send(JSON.stringify({ type: "vendorDisconnected", username }));
    }
  });
};

const handleDisconnect = (ws, wss) => {
  activeVendors.forEach((vendor, username) => {
    if (vendor.ws === ws) {
      removeVendor(username, wss);
    }
  });
};

export {
  registerVendor,
  sendVendorList,
  handleVendorLocation,
  removeVendor,
  handleDisconnect,
};
