import io from "socket.io-client";
import {Peer} from "./Peer";

export default class ConferenceClient {
  constructor(url) {
    this.peers = new Map();
    this.localId = null;
    this.socket = io(url, {secure: url.includes("https")});
    this.localStream = new MediaStream();
    this.remoteStream = new MediaStream();
    this.muted = {video: true, audio: false};
    this.onHost = null;
    this.onData = null;
    this.hostId = null;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1920,
          height: 1080,
        },
        audio: true,
      })
      .then((stream) => {
        stream.getTracks().forEach((track) => this.localStream.addTrack(track));
        this.setMuted(this.muted);
        this.join();
      })
      .catch(console.error);

    // init event handlers
    this.socket.on("message", this.handleMessage.bind(this));
    this.socket.on("peers", this.handlePeers.bind(this));
    this.socket.on("host", (id) => {
      this.host = id;
      return this.onHost(id === this.localId);
    });
  }

  join() {
    setTimeout(() => {
      console.log("Joining!");
      this.socket.emit("join", (id) => {
        this.localId = id;
        console.log(`Local Peer Id: ${id}`);
      });
    }, 1000);
  }

  requestHost() {
    this.socket.emit("host");
  }

  setMuted({audio, video}) {
    this.muted = {audio, video};
    this.localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !audio));
    this.localStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !video));
  }

  sendData(data) {
    for (const peer of this.peers.values()) {
      peer.sendData(data);
    }
  }

  handleMessage(data) {
    if (data.from === null) {
      console.warn("data.from is null.");
      return;
    }
    if (data.to === null || data.to !== this.localId) {
      console.warn("Received data does not match id.");
      return;
    }
    const peer = this.peers.get(data.from);
    if (peer) peer.signalRecieve(data);
  }

  handlePeers(serverIds) {
    console.log(`Server peer ids: ${serverIds}`);
    if (this.localId === null) return;
    serverIds = new Set(serverIds);
    // remove stale peers
    for (const id of this.peers.keys()) {
      if (!serverIds.has(id)) {
        this.peers.get(id).stop();
        this.peers.delete(id);
      }
    }
    // create new peers
    for (const remoteId of serverIds) {
      if (!this.peers.has(remoteId) && remoteId !== this.localId) {
        const peer = new Peer(
          this.localId < remoteId,
          this.localStream,
          this.remoteStream,
          (data) => {
            data.to = remoteId;
            data.from = this.localId;
            this.socket.send(data);
          },
        );
        peer.onData = (data) => this.onData(remoteId, data);
        this.peers.set(remoteId, peer);
      }
    }
  }
}
