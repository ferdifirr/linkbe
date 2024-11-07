// simulations/simulateVendors.js
import WebSocket from "ws";

// Fungsi untuk membuat vendor dan mengirimkan lokasi secara berkala
function simulateVendor(vendorName, latitude, longitude, additionalInfo) {
  const interval = Math.floor(Math.random() * 5000) + 3000;
  const ws = new WebSocket("ws://localhost:3000");

  ws.on("open", function open() {
    console.log(`${vendorName} connected to WebSocket`);

    // Kirim pesan handshake saat pertama kali connect
    const handshakeMessage = JSON.stringify({
      type: "handshake",
      role: "vendor",
      username: vendorName,
      latitude: latitude,
      longitude: longitude,
      additionalInfo: additionalInfo, // Informasi tambahan vendor
    });
    ws.send(handshakeMessage);
    console.log(`${vendorName} sent handshake message`);

    // Kirim lokasi vendor secara berkala dengan sedikit variasi
    setInterval(() => {
      const locationUpdateMessage = JSON.stringify({
        type: "locationUpdate",
        username: vendorName,
        latitude: latitude + Math.random() * 0.001,
        longitude: longitude + Math.random() * 0.001,
      });
      ws.send(locationUpdateMessage);
      console.log(`${vendorName} sent location update`);
    }, interval);
  });

  ws.on("message", function incoming(data) {
    console.log(`${vendorName} received message: ${data}`);
  });

  ws.on("close", function close() {
    console.log(`${vendorName} disconnected from WebSocket`);
  });

  ws.on("error", function error(err) {
    console.error(`${vendorName} encountered error: ${err.message}`);
  });
}


simulateVendor("Vendor1", -7.4948, 112.7154, "Toko Sembako");
simulateVendor("Vendor2", -7.4949, 112.7155, "Warung Nasi");
