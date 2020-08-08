/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from "react";
import {SafeAreaView, Text, StatusBar, StyleSheet} from "react-native";
import {mediaDevices, RTCView} from "react-native-webrtc";

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    display: "flex",
    backgroundColor: "#4F4",
  },
});

const App: () => React$Node = () => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!stream) {
      (async () => {
        const availableDevices = await mediaDevices.enumerateDevices();
        const {deviceId: sourceId} = availableDevices.find(
          (device) => device.kind === "videoinput" && device.facing === "front",
        );
        console.log(sourceId);
        availableDevices.forEach((device) => console.log(device));
        const streamBuffer = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
          optional: [{sourceId}],
        });
        setStream(streamBuffer);
      })();
    }
  }, [stream]);

  return (
    <RTCView
      streamURL={stream?.toURL()}
      objectFit={"contain"}
      style={styles.viewer}
    />
  );
};

export default App;
