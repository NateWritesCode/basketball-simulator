import { Server, Socket as SocketIoSocket } from "socket.io";
import * as http from "http";

class Socket {
  io: Server;
  socket: SocketIoSocket | undefined;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {});

    this.io.on("connection", (socket) => {
      console.log("User connected");
      this.socket = socket;

      socket.on("disconnect", (reason) => {
        console.log("User disconnected");
      });
    });
  }

  emit = (message: string) => {
    if (this.socket) {
      this.socket.emit("gameEvent", message);
    }
  };
}

export default Socket;
