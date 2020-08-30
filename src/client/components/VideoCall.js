import React, {useState} from "react";
import ConferenceClient from "../../conference/ConferenceClient";
import config from "../../config";
import {makeStyles} from "@material-ui/core/styles";
import {ConferencePanel, ButtonTypes} from "./ConferencePanel";
import {setIn} from "formik";

const useStyles = makeStyles({
  fillParent: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
  videoCall: {
    "background-color": "black",
  },
  video: {
    width: "100%",
    height: "100%",
    "object-fit": "contain",
    "object-position": "center",
  },
});

const conferenceClient = new ConferenceClient(`https://${config.ip}:3000`);

export default function VideoCall() {
  const video = React.createRef();
  const classes = useStyles();
  const [muted, setMuted] = useState({video: true, audio: false});
  const [recording, setRecording] = useState(false);
  const [pointerEnabled, setPointerEnabled] = useState(false);

  React.useEffect(
    function () {
      if (video.current) {
        video.current.srcObject = muted.video
          ? conferenceClient.remoteStream
          : conferenceClient.localStream;
      }
    },
    [video, muted],
  );

  function startRecord() {
    // TODO: return true if recording started else false
  }

  function stopRecord() {
    // TODO: return false if recording ended else true
  }

  function onClick(type) {
    switch (type) {
      case ButtonTypes.MUTE_VIDEO:
        setMuted((prevState) => ({...prevState, video: !prevState.video}));
        break;
      case ButtonTypes.MUTE_AUDIO:
        setMuted((prevState) => ({...prevState, audio: !prevState.audio}));
        break;
      case ButtonTypes.SWITCH_CAMERA:
        // TODO
        break;
      case ButtonTypes.SCREENSHOT:
        // TODO
        break;
      case ButtonTypes.RECORD:
        setRecording((prevState) => (prevState ? stopRecord() : startRecord()));
        break;
      case ButtonTypes.POINTER:
        setPointerEnabled((prevState) => !prevState);
        break;
      default:
        console.error(`Unhandled ButtonType ${type}`);
    }
  }

  return (
    <div className={`${classes.fillParent} ${classes.videoCall}`}>
      <ConferencePanel
        minimizable={true}
        muted={muted}
        recording={recording}
        pointerEnabled={pointerEnabled}
        onClick={onClick}
      />
      <video
        className={classes.video}
        ref={video}
        autoPlay
        onMouseMove={(event) => {
          if (pointerEnabled) {
            const position = [event.offsetX, event.offsetY];
            // TODO
          }
        }}
      />
    </div>
  );
}
