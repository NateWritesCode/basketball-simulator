import { io, Socket } from "socket.io-client";

class GameSimSocket {
  setState: React.Dispatch<React.SetStateAction<never[]>> | undefined;
  socket: Socket;

  constructor() {
    this.socket = io("ws://localhost:8080", {
      transports: ["websocket"],
    });
  }

  init = (setState: React.Dispatch<React.SetStateAction<never[]>>) => {
    this.socket.on("connect", () => {
      console.log("Connected to the game sim!");
    });

    this.socket.on("gameEvent", (gameEventData) => {
      console.log("gameEventData", gameEventData);
      // setState(gameEventData);
    });
  };

  close = () => {
    this.socket.disconnect();
  };
}

const socket = new GameSimSocket();

export default socket;
