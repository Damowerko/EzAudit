import io from "socket.io-client";

const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};

class Peer {
  constructor(polite, localStream, remoteStream, signalSend) {
    this.polite = polite;
    this.signalSend = signalSend;
    this.localStream = localStream;
    this.remoteStream = remoteStream;

    this.makingOffer = false;
    this.ignoreOffer = false;
    this.pc = new RTCPeerConnection(configuration);
    this.pc.onnegotiationneeded = async (options) => {
      await this.pc.setLocalDescription(await this.pc.createOffer(options));
      this.signalSend({
        description: this.pc.localDescription,
      });
    };
    this.pc.onicecandidate = ({candidate}) =>
      this.signalSend({candidate: candidate});
    this.pc.oniceconnectionstatechange = () => {
      if (this.pc.iceConnectionState === "failed") {
        this.pc.restartIce();
      }
    };
    // any incoming tracks will be added
    this.pc.ontrack = (ev) => this.remoteStream.addTrack(ev.track);
    // add all existing tracks
    this.localStream.getTracks().forEach((track) => this.pc.addTrack(track));
    // any new tracks will be added
    this.localStream.onaddtrack = (ev) => this.pc.addTrack(ev.track);
  }

  async signalRecieve({description, candidate}) {
    try {
      if (description) {
        const offerCollision =
          description.type === "offer" &&
          (this.makingOffer || this.pc.signalingState !== "stable");

        this.ignoreOffer = !this.polite && offerCollision;
        if (this.ignoreOffer) {
          return;
        }

        await this.pc.setRemoteDescription(description);
        if (description.type === "offer") {
          await this.pc.setLocalDescription();
          this.signalSend({
            description: this.pc.localDescription,
          });
        }
      } else if (candidate) {
        try {
          await this.pc.addIceCandidate(candidate);
        } catch (err) {
          if (!this.ignoreOffer) {
            // noinspection ExceptionCaughtLocallyJS
            throw err;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default class ConferenceClient {
  constructor(url) {
    this.peers = new Map();
    this.localId = null;
    this.socket = io(url, {secure: url.includes("https")});
    this.localStream = new MediaStream();
    this.remoteStream = new MediaStream();
    navigator.mediaDevices
      .getUserMedia({video: true, audio: true})
      .then((stream) =>
        stream.getTracks().forEach((track) => this.localStream.addTrack(track)),
      )
      .catch(console.error);

    // init event handlers last
    this.socket.on("message", this.handleMessage.bind(this));
    this.socket.on("peers", this.handlePeers.bind(this));
  }

  join() {
    this.socket.emit("join", (id) => (this.localId = id));
  }

  handleMessage(data) {
    console.log(data);
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
    if (this.localId === null) return;
    serverIds = new Set(serverIds);
    // remove stale peers
    for (const id of this.peers.keys()) {
      if (!serverIds.has(id)) {
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
        this.peers.set(remoteId, peer);
      }
    }
  }
}
