import React, {useState, useEffect} from "react";
import io from "socket.io-client";

const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};
const pc = new RTCPeerConnection(configuration);
const socket = io("http://localhost:4000");

socket.on("message", async function ({offer, candidate}) {
  try {
    if (offer) {
      await pc.setRemoteDescription(offer);
      await pc.setLocalDescription();
      socket.send({answer: pc.localDescription});
    } else if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  } catch (e) {
    console.error(e);
  }
});

pc.onicecandidate = function (candidate) {
  //socket.send({candidate: candidate});
};

const stream = new MediaStream();

export default function VideoCall() {
  const videoRef = React.createRef();

  useEffect(
    function () {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = stream;
      }
    },
    [videoRef],
  );

  useEffect(function () {
    setInterval(function () {
      console.log(JSON.stringify(pc.getRemoteStreams()));
    }, 1000);
  }, []);

  return (
    <div>
      <button onClick={makeCall}>Call</button>
      <video ref={videoRef} autoPlay />
    </div>
  );
}

async function makeCall() {
  socket.emit("login", false);
}
