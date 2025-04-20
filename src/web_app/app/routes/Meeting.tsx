import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

import MeetingContainer from "../components/Container";
import Card from "../components/Card";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useLocalStream } from "../hooks/localStream";

const MeetingCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    maxWidth: "850px",
  },
}));

export default function Meeting() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [interviewTitle, setInteriewTitle] = useState("Interview");
  const [interviewTime, setInterviewTime] = useState(new Date());
  const mediaStream = useLocalStream();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  const toggleVideo = () => {
    const videoTracks = mediaStream.stream?.getVideoTracks();
    if (!videoTracks || !videoTracks?.length) return;
    for (var i = 0; i < videoTracks.length; ++i) {
      videoTracks[i].enabled = !videoTracks[i].enabled;
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    const audioTracks = mediaStream.stream?.getAudioTracks();
    if (!audioTracks || !audioTracks?.length) return;
    for (var i = 0; i < audioTracks.length; ++i) {
      audioTracks[i].enabled = !audioTracks[i].enabled;
    }
    setIsAudioOn(!isAudioOn);
  };

  const joinMeeting = () => {
    navigate("./join", {
      state: {
        audio: isAudioOn,
        video: isVideoOn,
      },
    });
  };

  useEffect(() => {
    if (mediaStream.ready) {
      setIsAudioOn(true);
      setIsVideoOn(true);
      if (videoRef.current) videoRef.current.srcObject = mediaStream.stream;
    }
  }, [mediaStream.ready]);

  return (
    <MeetingContainer>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <MeetingCard>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {interviewTitle}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
            >
              {interviewTime.toDateString()}
            </Typography>
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1, gap: 2 }}
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
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ width: "100%", aspectRatio: 16 / 9 }}>
            <video
              ref={videoRef}
              aria-label="video"
              autoPlay
              playsInline
              className="rounded-lg"
            ></video>
          </Paper>
        </Box>
      </MeetingCard>
      <Box className="w-1/3 self-center">
        {mediaStream.ready ? (
          <Button className="w-full" variant="contained" onClick={joinMeeting}>
            Join Now
          </Button>
        ) : (
          // TODO: Replacing with loading indicator and info snackbar
          <Typography
            className="w-full"
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
          >
            Getting Ready...
          </Typography>
        )}
      </Box>
    </MeetingContainer>
  );
}
