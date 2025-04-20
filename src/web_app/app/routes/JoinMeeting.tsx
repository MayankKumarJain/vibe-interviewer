import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router";
import MeetingContainer from "../components/Container";
import Card from "../components/Card";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useLocalStream } from "../hooks/localStream";

const MeetingCard = styled(Card)(({ theme }) => ({
  width: "100%",
}));

export default function JoinMeeting() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const localStream = useLocalStream();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const { state } = useLocation();

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
    setIsAudioOn(state.audio);
    setIsVideoOn(state.video);
  }, []);

  const toggleVideo = () => {
    const videoTracks = localStream.current?.getVideoTracks();
    if (!videoTracks || !videoTracks?.length) return;
    for (var i = 0; i < videoTracks.length; ++i) {
      videoTracks[i].enabled = !videoTracks[i].enabled;
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    const audioTracks = localStream.current?.getAudioTracks();
    if (!audioTracks || !audioTracks?.length) return;
    for (var i = 0; i < audioTracks.length; ++i) {
      audioTracks[i].enabled = !audioTracks[i].enabled;
    }
    setIsAudioOn(!isAudioOn);
  };

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
          <IconButton aria-label="video play/pause">
            {!isVideoOn ? (
              <VideocamOffIcon
                color="error"
                sx={{ height: 38, width: 38 }}
                onClick={() => toggleVideo()}
              />
            ) : (
              <VideocamIcon
                color="info"
                sx={{ height: 38, width: 38 }}
                onClick={() => toggleVideo()}
              />
            )}
          </IconButton>
          <IconButton aria-label="audio play/pause">
            {!isAudioOn ? (
              <MicOffIcon
                color="error"
                sx={{ height: 38, width: 38 }}
                onClick={() => toggleAudio()}
              />
            ) : (
              <MicIcon
                color="info"
                sx={{ height: 38, width: 38 }}
                onClick={() => toggleAudio()}
              />
            )}
          </IconButton>
        </CardActions>
      </MeetingCard>
    </MeetingContainer>
  );
}
