import React from "react";
import ConferenceClient from "../conference/ConferenceClient";

export default function VideoCall() {
  const localVideo = React.createRef();
  const remoteVideo = React.createRef();
  const [conferenceClient] = React.useState(
    new ConferenceClient("http://localhost:4000"),
  );

  React.useEffect(
    function () {
      if (localVideo.current && !localVideo.current.srcObject) {
        localVideo.current.srcObject = conferenceClient.localStream;
      }
      if (remoteVideo.current && !remoteVideo.current.srcObject) {
        remoteVideo.current.srcObject = conferenceClient.remoteStream;
      }
    },
    [conferenceClient, localVideo, remoteVideo],
  );

  return (
    <div>
      <video ref={localVideo} autoPlay />
      <video ref={remoteVideo} autoPlay />
      <button onClick={conferenceClient.join.bind(conferenceClient)}>
        Join
      </button>
    </div>
  );
}
