import io from "socket.io-client";

const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};

class Peer {
  constructor(polite, localStream, remoteStream, signalSend) {
    this.polite = polite;
    this.signalSend = signalSend;
    this.localStream = localStream;
    this.remoteStream = remoteStream;
    this.tracks = [];

    this.makingOffer = false;
    this.ignoreOffer = false;
    this.pc = new RTCPeerConnection(configuration);
    // any incoming tracks will be added
    this.pc.ontrack = (ev) => {
      this.tracks.push(ev.track);
      return this.remoteStream.addTrack(ev.track);
    };
    // any new tracks will be added
    this.localStream.onaddtrack = (ev) => this.pc.addTrack(ev.track);
    // add all existing tracks
    this.localStream.getTracks().forEach((track) => this.pc.addTrack(track));

    // signaling callbacks
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
  }

  /***
   * Stop all tracks received from the peer.
   */
  stop() {
    this.tracks.forEach((track) => track.stop());
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
    this.muted = {video: true, audio: false};

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

  setMuted({audio, video}) {
    this.muted = {audio, video};
    this.localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !audio));
    this.localStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !video));
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
        this.peers.set(remoteId, peer);
      }
    }
  }
}
