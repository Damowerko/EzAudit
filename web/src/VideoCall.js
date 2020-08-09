import React, {useState, useEffect} from "react";
import io from "socket.io-client";

const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};
const peerConnection = new RTCPeerConnection(configuration);
const socket = io("http://localhost:4000");
const stream = new MediaStream();

export default function VideoCall() {
  const videoRef = React.createRef();

  useEffect(function () {
    setInterval(function () {
      console.log(peerConnection.connectionState);
    }, 1000);
  }, []);

  useEffect(function () {
    peerConnection.onaddstream = function (event) {
      console.log("Added track.");
      stream.addTrack(event.track, stream);
    };
  }, []);

  useEffect(
    function () {
      if (videoRef.current && !videoRef.current.srcObject) {
        console.log("Set srcObject.");
        videoRef.current.srcObject = stream;
      }
    },
    [videoRef],
  );

  return (
    <div>
      <button onClick={makeCall}>Call</button>
      <video ref={videoRef} autoPlay />
    </div>
  );
}

async function makeCall() {
  socket.on("answer", async function (data) {
    console.log("Got answer!");
    if (peerConnection.signalingState === "have-local-offer") {
      const remoteDesc = new RTCSessionDescription(data);
      await peerConnection.setRemoteDescription(remoteDesc);
    }
  });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit("offer", offer);
  console.log("Sent offer!");
}
