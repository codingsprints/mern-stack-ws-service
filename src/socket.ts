import { createServer } from "node:http";
import { Server } from "socket.io";
import { configENV } from "./config/config";

const wsServer = createServer();

// todo: move origin value to the config.
const ALLOWED_DOMAINS = [configENV.adminUI, configENV.clientUI];

const io = new Server(wsServer, {
  cors: { origin: ALLOWED_DOMAINS as string[] },
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
