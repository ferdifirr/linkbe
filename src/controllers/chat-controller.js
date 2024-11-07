import { prismaClient } from "../app/database";

const handleChatMessage = async (ws, data, wss) => {
  const { sender, receiver, message } = data;

  // Find the WebSocket connection for the receiver
  const receiverWs = [...wss.clients].find(
    (client) => client.username === receiver
  );

  const savedMessage = await prismaClient.message.create({
    data: {
      sender,
      receiver,
      message,
      status: receiverWs ? "received" : "pending",
      timestamp: new Date(),
    },
  });

  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    receiverWs.send(
      JSON.stringify({
        type: "chatMessage",
        sender,
        message,
        timestamp: savedMessage.timestamp,
        status: "received",
      })
    );
  } else {
    console.log(`Receiver ${receiver} is not connected.`);
    // Optionally store or log unsent messages
  }
};

const checkPendingMessages = async (ws) => {
  ws.username = ws.username;
  const pendingMessages = await prismaClient.message.findMany({
    where: { receiver: data.username, status: "pending" },
    orderBy: { timestamp: "asc" },
  });
  pendingMessages.forEach(async (msg) => {
    ws.send(
      JSON.stringify({
        type: "chatMessage",
        sender: msg.sender,
        message: msg.message,
        timestamp: msg.timestamp,
        status: "received",
      })
    );
    await prisma.message.update({
      where: { id: msg.id },
      data: { status: "received" },
    });
  });
  const readedMessages = await prismaClient.message.findMany({
    where: { sender: data.username, status: "read" },
  });
  if (readedMessages.length > 0) {
    ws.send(
      JSON.stringify({
        type: "messageStatus",
        messageIds: readedMessages.map((msg) => msg.id),
        status: "read",
      })
    );
  }
};

const updateMessageStatus = async (data, wss) => {
  const messageIds = data.messageIds;
  const messages = await prismaClient.message.findMany({
    where: { id: { in: messageIds } },
  });
  await prismaClient.message.updateMany({
    where: { id: { in: messageIds } },
    data: { status: "read" },
  });
  for (const msg of messages) {
    const senderWs = [...wss.clients].find(
      (client) => client.username === msg.sender
    );
    if (senderWs && senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(
        JSON.stringify({
          type: "messageStatus",
          messageIds: [msg.id],
          status: "read",
        })
      );
      await prismaClient.message.delete({
        where: { id: msg.id },
      });
    }
  }
};

export { handleChatMessage, checkPendingMessages, updateMessageStatus };
