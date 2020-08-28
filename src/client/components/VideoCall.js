import React, {useState} from "react";
import ConferenceClient from "../../conference/ConferenceClient";
import config from "../../config";
import {makeStyles} from "@material-ui/core/styles";
import ConferencePanel from "./ConferencePanel";
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
    "background-color": "dimgrey",
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

  React.useEffect(
    function () {
      if (video.current) {
        console.log(muted);
        video.current.srcObject = muted.video
          ? conferenceClient.remoteStream
          : conferenceClient.localStream;
      }
    },
    [video, muted],
  );

  return (
    <div className={`${classes.fillParent} ${classes.videoCall}`}>
      <ConferencePanel
        minimizable={true}
        conferenceClient={conferenceClient}
        muted={muted}
        setMuted={setMuted}
      />
      {/*<img*/}
      {/*  className={classes.video}*/}
      {/*  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"*/}
      {/*/>*/}
      <video className={classes.video} ref={video} autoPlay />
    </div>
  );
}
