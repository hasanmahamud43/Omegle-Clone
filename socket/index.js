import http from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const waitingQueue = [];
const activePairs = new Map();

function matchUser(socket) {
  if (waitingQueue.includes(socket.id)) return;

  if (waitingQueue.length > 0) {
    const partner = waitingQueue.shift();

    if (!partner) {
      waitingQueue.push(socket.id);
      socket.emit("waiting");
      return;
    }

    const roomId = uuid();

    activePairs.set(socket.id, partner);
    activePairs.set(partner, socket.id);

    socket.emit("matched", { roomId });
    io.to(partner).emit("matched", { roomId });
  } else {
    waitingQueue.push(socket.id);
    socket.emit("waiting");
  }
}

function handleLeave(id) {
  const index = waitingQueue.indexOf(id);

  if (index !== -1) {
    waitingQueue.splice(index, 1);
  }

  const partner = activePairs.get(id);

  if (partner) {
    io.to(partner).emit("partner_left");
    activePairs.delete(id);
    activePairs.delete(partner);
  }
}

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("start", () => {
    matchUser(socket);
  });

  socket.on("next", () => {
    handleLeave(socket.id);
    matchUser(socket);
  });

  socket.on("disconnect", () => {
    handleLeave(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on("name", (data) => {
    console.log(`Client ${socket.id} sent name: ${data}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});