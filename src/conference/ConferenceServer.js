const Server = require("socket.io");

class ConferenceServer {
  constructor(http) {
    this.io = new Server(http);
    this.sockets = new Map();
    this.io.sockets.on("connection", this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    this.sockets.set(socket);
    socket.on("disconnect", () => this.ids.delete(socket.id));
    socket.on("message", (data) => this.handleMessage(socket, data));
  }

  handleMessage(socket, data) {
    if (data.to === null) return;
    data.from = socket.id;

    this.io.sockets.emit("message", data);
  }
}
