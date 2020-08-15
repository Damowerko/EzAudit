import io from "socket.io-client";

const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};

class Peer {
  constructor(localId, remoteId, stream, handleSend) {
    this.polite = localId < remoteId;
    this.handleSend = handleSend;
    this.stream = stream;

    this.makingOffer = false;
    this.ignoreOffer = false;
    this.pc = new RTCPeerConnection(configuration);
    this.pc.onnegotiationneeded = async (options) => {
      await this.pc.setLocalDescription(await this.pc.createOffer(options));
      this.handleSend({
        description: this.pc.localDescription,
      });
    };
    this.pc.oniceconnectionstatechange = () => {
      if (this.pc.iceConnectionState === "failed") {
        this.pc.restartIce();
      }
    };
    this.pc.ontrack = (ev) => this.stream.addTrack(ev.track);
  }

  addTrack(track) {
    this.pc.addTrack(track);
  }

  async handleMessage({data: {description, candidate}}) {
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
          this.handleSend({
            description: this.pc.localDescription,
            from: this.localId,
            to: this.remoteId,
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
    this.handleMessage = this.handleMessage.bind(this);

    this.peers = new Map();
    this.host = null;
    this.socket = io(url);
    this.localStream = new MediaStream();
    this.remoteStream = new MediaStream();

    // init event handlers last
    this.socket.on("message", this.handleMessage);
    this.socket.on("peers", this.handlePeers);
  }

  handleMessage(data) {
    if (data.from === null) {
      console.error("data.from is null.");
      return;
    }
    const peer = this.peers.get(data.from);
    if (peer) peer.handleMessage(data);
  }

  handlePeers(serverIds) {
    serverIds = new Set(serverIds);
    // remove stale peers
    for (const id of this.peers.keys()) {
      if (!serverIds.has(id)) {
        this.peers.delete(id);
      }
    }
    // create new peers
    for (const id of serverIds) {
      if (!(this.peers.has(id) || id === this.socket.id)) {
        const peer = new Peer(this.socket.id, id, this.remoteStream, function (data) {
          data.to = id;
          this.socket.send(data);
        });
        this.peers.set(id, peer);
      }
    }
  }
}
