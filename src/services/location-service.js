export function broadcastLocation(ws, data, wss) {
  wss.clients.forEach((client) => {
    if (
      client !== ws &&
      client.readyState === client.OPEN &&
      client.role === "user"
    ) {
      console.log(
        `Sending location update to user ${client.username}: lat ${data.latitude}, long ${data.longitude}`
      );
      client.send(
        JSON.stringify({
          type: "locationUpdate",
          username: data.username,
          latitude: data.latitude,
          longitude: data.longitude,
        })
      );
    }
  });
}
