import React from "react";
import ConferenceClient from "../../conference/ConferenceClient";
import config from "../../config";
import {makeStyles} from "@material-ui/core/styles";
import ConferencePanel from "./ConferencePanel";

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

export default function VideoCall() {
  const localVideo = React.createRef();
  const remoteVideo = React.createRef();
  const [conferenceClient] = React.useState(
    new ConferenceClient(`https://${config.ip}:3000`),
  );
  const classes = useStyles();

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
    <div className={`${classes.fillParent} ${classes.videoCall}`}>
      <ConferencePanel minimizable={true} conferenceClient={conferenceClient} />
      {/*<img*/}
      {/*  className={classes.video}*/}
      {/*  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"*/}
      {/*/>*/}
      <video className={classes.video} ref={remoteVideo} autoPlay />
    </div>
  );
}
