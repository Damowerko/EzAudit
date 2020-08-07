/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {SafeAreaView, Text, StatusBar} from "react-native";
import {mediaDevices} from "react-native-webrtc";

const App: () => React$Node = () => {
  let isFront = true;
  mediaDevices.enumerateDevices().then((sourceInfos) => {
    console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind === "videoinput" &&
        sourceInfo.facing === (isFront ? "front" : "environment")
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? "user" : "environment",
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((stream) => {
        // Got stream!
      })
      .catch((error) => {
        // Log error
      });
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Test</Text>
      </SafeAreaView>
    </>
  );
};

export default App;
