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
  MouseOutlined,
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

export default function ConferencePanel({conferenceClient, minimizable}) {
  const [minimized, setMinimized] = useState(minimizable);
  const [muted, setMuted] = useState({video: true, audio: false});
  const [pointerEnabled, setPointerEnabled] = useState(false);

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
        <Fab
          onClick={() => setMuted((prev) => ({...prev, video: !prev.video}))}>
          {muted.video ? <VideocamOff /> : <Videocam />}
        </Fab>
        <Fab
          onClick={() => setMuted((prev) => ({...prev, audio: !prev.audio}))}>
          {muted.audio ? <MicOff /> : <Mic />}
        </Fab>
        <Fab onClick={() => console.log("Switch Camera!")}>
          <SwitchCamera />
        </Fab>
        <Fab onClick={() => console.log("Screenshot!")}>
          <PhotoCamera />
        </Fab>
        <Fab onClick={() => console.log("Start recording!")}>
          <FiberManualRecord />
        </Fab>
        <Fab onClick={() => setPointerEnabled((prev) => !prev)}>
          {pointerEnabled ? <Mouse /> : <MouseOutlined />}
        </Fab>
      </TransitionStack>
    </div>
  );
}
