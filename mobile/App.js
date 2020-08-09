/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import io from "socket.io-client";

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    display: "flex",
    backgroundColor: "#4F4",
  },
});

const socket = io("http://192.168.1.100:4000");
const configuration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};
const peerConnection = new RTCPeerConnection();

peerConnection.onconnectionstatechange = function (event) {
  console.log(`Connction state: ${peerConnection.connectionState}`);
};

socket.on("offer", async (data) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit("answer", answer);
});

export default function App() {
  const [stream, setStream] = useState(null);

  useEffect(function () {
    (async () => {
      const availableDevices = await mediaDevices.enumerateDevices();
      const {deviceId: sourceId} = availableDevices.find(
        (device) => device.kind === "videoinput" && device.facing === "front",
      );
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
        optional: [{sourceId}],
      });
      setStream(mediaStream);
    })();
  }, []);

  useEffect(
    function () {
      if (stream) {
        peerConnection
          .getLocalStreams()
          .forEach((local) => peerConnection.removeStream(local));
        peerConnection.addStream(stream);
        console.log(JSON.stringify(peerConnection.getLocalStreams()));
      }
    },
    [stream],
  );

  return (
    <RTCView
      streamURL={stream?.toURL()}
      objectFit={"contain"}
      style={styles.viewer}
    />
  );
}
