import { createServer } from "node:http";
import config from "config";
import { Server } from "socket.io";

const wsServer = createServer();

// todo: move origin value to the config.
// const ALLOWED_DOMAINS = [
//   config.get("frontend.clientUI"),
//   config.get("frontend.adminUI"),
// ];

// const io = new Server(wsServer, { cors: { origin:  ALLOWED_DOMAINS as string[]} });
const io = new Server(wsServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  // client
  socket.on("join", (data) => {
    socket.join(String(data.tenantId));

    // console.log(io.of("/").adapter.rooms);

    // server
    socket.emit("join", { roomId: String(data.tenantId) });
  });
});

export default {
  wsServer,
  io,
};
