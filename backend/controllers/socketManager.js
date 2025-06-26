import { Server } from "socket.io";

// Store connected sockets per room path
const connections = {};
const messages = {};
const timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // When user joins a room
    socket.on("join-call", (roomId) => {
      if (!connections[roomId]) {
        connections[roomId] = [];
      }

      connections[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify other users
      connections[roomId].forEach(id => {
        io.to(id).emit("user-joined", socket.id, connections[roomId]);
      });

      // Send old messages to new user
      if (messages[roomId]) {
        messages[roomId].forEach(msg => {
          io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
        });
      }
    });

    // WebRTC Signal Relay
    socket.on("signal", (toId, signalData) => {
      io.to(toId).emit("signal", socket.id, signalData);
    });

    // Chat message within a room
    socket.on("chat-message", (data, sender) => {
      const [roomId] = Object.entries(connections).find(([_, ids]) =>
        ids.includes(socket.id)
      ) || [];

      if (roomId) {
        if (!messages[roomId]) {
          messages[roomId] = [];
        }

        const messageObj = {
          sender,
          data,
          "socket-id-sender": socket.id
        };

        messages[roomId].push(messageObj);
        console.log(`💬 ${sender} in room ${roomId}: ${data}`);

        connections[roomId].forEach(id => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const disconnectTime = new Date();
      const joinedTime = timeOnline[socket.id] || disconnectTime;
      const timeSpent = Math.abs(disconnectTime - joinedTime);

      delete timeOnline[socket.id];

      for (const [roomId, socketList] of Object.entries(connections)) {
        const index = socketList.indexOf(socket.id);
        if (index !== -1) {
          // Notify others
          socketList.forEach(id => {
            io.to(id).emit("user-left", socket.id);
          });

          // Remove user from room
          socketList.splice(index, 1);

          // Clean up empty room
          if (socketList.length === 0) {
            delete connections[roomId];
          }

          break;
        }
      }

      console.log(`❌ Socket disconnected: ${socket.id} (online for ${timeSpent / 1000}s)`);
    });
  });

  return io;
};
