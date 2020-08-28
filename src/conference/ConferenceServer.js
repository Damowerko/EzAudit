const SocketIoServer = require("socket.io");

module.exports = class ConferenceServer {
  constructor(server) {
    this.io = new SocketIoServer(server);
    this.peers = new Map();
    this.peersReverse = new Map();
    this.io.sockets.on("connection", this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    socket.on("join", (callback) => this.handleJoin(socket, callback));
    socket.on("message", (data) => this.handleMessage(socket, data));
    socket.on("disconnect", () => this.deleteSocket(socket));
  }

  addSocket(socket) {
    if (this.peersReverse.has(socket)) {
      return this.peersReverse.get(socket);
    }
    let id;
    do {
      id = Math.floor(Math.random() * 1000);
    } while (this.peers.has(id));
    this.peers.set(id, socket);
    this.peersReverse.set(socket, id);
    return id;
  }

  deleteSocket(socket) {
    if (this.peersReverse.has(socket)) {
      const id = this.peersReverse.get(socket);
      this.peers.delete(id);
      this.peersReverse.delete(socket);
    }
    this.sendPeers();
  }

  deleteId(id) {
    if (this.peers.has(id)) {
      const socket = this.peers.get(id);
      this.peers.delete(id);
      this.peersReverse.delete(socket);
    }
  }

  handleJoin(socket, callback) {
    let id = this.addSocket(socket);
    callback(id);
    this.sendPeers();
  }

  handleMessage(fromSocket, data) {
    data.from = this.peersReverse.get(fromSocket);
    if (data.from === null) return;
    const toSocket = this.peers.get(data.to);
    if (toSocket) toSocket.send(data);
  }

  sendPeers() {
    const peerIds = [...this.peers.keys()];
    console.log(`Peer Ids: ${peerIds}`);
    this.io.sockets.emit("peers", peerIds);
  }
}
