import React, {createRef, useEffect, useState} from "react";
import ConferenceClient from "../../conference/ConferenceClient";
import config from "../../config";
import {makeStyles} from "@material-ui/core/styles";
import {ConferencePanel, ButtonTypes} from "./ConferencePanel";

const useStyles = makeStyles({
  fillParent: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
  videoCall: {
    "background-color": "dimgray",
  },
  video: {
    width: "100%",
    height: "100%",
    "object-fit": "contain",
    "object-position": "center",
  },
  pointer: ({pointerPosition}) => (pointerPosition !== null ? {
    top: `${pointerPosition[0]}`,
    left: `${pointerPosition[1]}`,
    "border-radius": "50%",
    width: "1rem",
    height: "1rem",
  } : {}),
});


const conferenceClient = new ConferenceClient(`https://${config.ip}:3000`);

export default function VideoCall() {
  const videoRef = createRef();
  const pointerRef = createRef();
  const [muted, setMuted] = useState({video: true, audio: false});
  const [recording, setRecording] = useState(false);
  const [pointerEnabled, setPointerEnabled] = useState(false);
  const [pointerPosition, setPointerPosition] = useState(null);

  const classes = useStyles({pointerPosition});

  useEffect(function () {
    setInterval(
      () => console.log(conferenceClient.localStream.getVideoTracks()),
      1000,
    );
  }, []);

  useEffect(
    function () {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = conferenceClient.localStream;
      }
    },
    [videoRef, muted],
  );

  useEffect(
    function () {
      conferenceClient.onHost = function (isHost) {
        if (isHost) {
          setMuted((prevState) => ({...prevState, video: false}));
        } else {
          setMuted((prevState) => ({...prevState, video: true}));
        }
      };
      conferenceClient.onData = function (id, data) {
        const {pointerPosition} = data;
        if (pointerPosition && videoRef.current) {
          // convert pointer position to coordinates on this device
          const {
            x,
            y,
            width,
            height,
          } = videoRef.current.getBoundingClientRect();

          setPointerPosition([
            x + pointerPosition[0] * width,
            y + pointerPosition[1] * height,
          ]);
        }
      };
    },
    [videoRef],
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
        if (muted.video) {
          conferenceClient.requestHost();
        }
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
        ref={videoRef}
        autoPlay
        onMouseMove={(event) => {
          if (pointerEnabled && videoRef.current) {
            conferenceClient.sendData({
              pointerPosition: [
                event.offsetX / videoRef.current.width,
                event.offsetY / videoRef.current.height,
              ],
            });
          }
        }}
      />
      <div className={classes.pointer} ref={pointerRef} />
    </div>
  );
}
