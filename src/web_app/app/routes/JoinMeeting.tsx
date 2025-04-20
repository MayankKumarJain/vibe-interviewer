import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { styled, SxProps } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MeetingContainer from "../components/Container";
import Card from "../components/Card";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useLocalStream } from "../hooks/localStream";
import usePeerConnection from "../hooks/PeerConnection";

const MeetingCard = styled(Card)(() => ({
  width: "100%",
}));

export default function JoinMeeting() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const localStream = useLocalStream();
  const {peerConnection, remoteStream, isRemoteStreamReady} = usePeerConnection();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const { state } = useLocation();

  const iconBaseStyles: SxProps = {
    height: 48,
    width: 48,
    padding: 1,
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.stream;
    }
    if (state && state.audio !== undefined && state.video !== undefined) {
      setIsAudioOn(state.audio ?? false);
      setIsVideoOn(state.video ?? false);
    }
  }, [localStream.ready]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream.current) {
      console.log({ rem: remoteStream.current });
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [isRemoteStreamReady]);

  const toggleVideo = () => {
    const videoTracks = localStream.stream?.getVideoTracks();
    if (!videoTracks || !videoTracks?.length) return;
    for (var i = 0; i < videoTracks.length; ++i) {
      videoTracks[i].enabled = !videoTracks[i].enabled;
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    const audioTracks = localStream.stream?.getAudioTracks();
    if (!audioTracks || !audioTracks?.length) return;
    for (var i = 0; i < audioTracks.length; ++i) {
      audioTracks[i].enabled = !audioTracks[i].enabled;
    }
    setIsAudioOn(!isAudioOn);
  };

  const hangUp = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.stream) {
      localStream.close();
    }
  }

  return (
    <MeetingContainer>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <MeetingCard sx={{ flexDirection: "column" }}>
        <Box
          sx={{
            minHeight: "450px",
          }}
          className="grid grid-cols-2 gap-2 w-full"
        >
          <Paper elevation={3} className="flex justify-center content-center">
            <video
              ref={localVideoRef}
              aria-label="video"
              autoPlay
              playsInline
              className="rounded-lg min-w-1/2"
            ></video>
          </Paper>
          <Paper elevation={3}>
            <video
              ref={remoteVideoRef}
              aria-label="video"
              autoPlay
              playsInline
              className="rounded-lg min-w-1/2"
            ></video>
          </Paper>
        </Box>

        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            pl: 1,
            pb: 1,
            gap: 2,
          }}
        >
          <IconButton aria-label="video play/pause" sx={iconBaseStyles}>
            {!isVideoOn ? (
              <VideocamOffIcon color="error" onClick={toggleVideo} />
            ) : (
              <VideocamIcon color="info" onClick={toggleVideo} />
            )}
          </IconButton>
          <IconButton aria-label="audio play/pause" sx={iconBaseStyles}>
            {!isAudioOn ? (
              <MicOffIcon color="error" onClick={toggleAudio} />
            ) : (
              <MicIcon color="info" onClick={toggleAudio} />
            )}
          </IconButton>
          <IconButton aria-label="hangup" sx={iconBaseStyles}>
            <CallEndIcon onClick={hangUp} color="error"></CallEndIcon>
          </IconButton>
        </CardActions>
      </MeetingCard>
    </MeetingContainer>
  );
}
