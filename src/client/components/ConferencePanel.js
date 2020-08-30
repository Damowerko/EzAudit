import {
  Add,
  Remove,
  FiberManualRecord,
  PhotoCamera,
  SwitchCamera,
  VideocamOff,
  MicOff,
  Mic,
  Videocam,
  Mouse,
  MouseOutlined, FiberManualRecordOutlined,
} from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import TransitionStack from "./TransitionStack";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles({
  buttonPanel: {
    display: "flex",
    bottom: "5vmin",
    right: "5vmin",
    "flex-direction": "column-reverse",
    position: "absolute",
    "z-index": 10,
    gap: "1em",
  },
});

export const ButtonTypes = {
  MUTE_AUDIO: "MUTE_AUDIO",
  MUTE_VIDEO: "MUTE_VIDEO",
  SWITCH_CAMERA: "SWITCH_CAMERA",
  SCREENSHOT: "SCREENSHOT",
  RECORD: "RECORD",
  POINTER: "POINTER",
};

export function ConferencePanel({minimizable, muted, recording, pointerEnabled, onClick}) {
  const [minimized, setMinimized] = useState(minimizable);

  useEffect(() => {
    setMinimized(minimizable);
  }, [minimizable]);

  const classes = useStyles();

  return (
    <div className={classes.buttonPanel}>
      <Fab onClick={() => minimizable && setMinimized((prev) => !prev)}>
        {minimized ? <Add /> : <Remove />}
      </Fab>
      <TransitionStack transition={<Zoom in={!minimized} />} delay={50}>
        <Fab onClick={() => onClick(ButtonTypes.MUTE_VIDEO)}>
          {muted.video ? <VideocamOff /> : <Videocam />}
        </Fab>
        <Fab onClick={() => onClick(ButtonTypes.MUTE_AUDIO)}>
          {muted.audio ? <MicOff /> : <Mic />}
        </Fab>
        <Fab onClick={() => onClick(ButtonTypes.SWITCH_CAMERA)}>
          <SwitchCamera />
        </Fab>
        <Fab onClick={() => ButtonTypes.SCREENSHOT}>
          <PhotoCamera />
        </Fab>
        <Fab onClick={() => ButtonTypes.RECORD}>
          {recording ? <FiberManualRecord /> : <FiberManualRecordOutlined />}
        </Fab>
        <Fab onClick={() => ButtonTypes.POINTER}>
          {pointerEnabled ? <Mouse /> : <MouseOutlined />}
        </Fab>
      </TransitionStack>
    </div>
  );
}
