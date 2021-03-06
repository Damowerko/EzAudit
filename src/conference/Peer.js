export class Peer {
  constructor(polite, localStream, remoteStream, signalSend) {
    this.polite = polite;
    this.signalSend = signalSend;
    this.localStream = localStream;
    this.remoteStream = remoteStream;
    this.tracks = [];
    this.onData = null;

    this.makingOffer = false;
    this.ignoreOffer = false;
    this.pc = new RTCPeerConnection({
      iceServers: [{urls: "stun:stun.l.google.com:19302"}],
    });
    this.dataChannel = this.pc.createDataChannel("data", {
      id: 0,
      negotiated: true,
    });

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
    this.pc.onmessage = function (event) {
      if (this.onData) {
        this.onData(JSON.parse(event.data));
      }
    };
  }

  sendData(data) {
    this.dataChannel.send(JSON.stringify(data));
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
