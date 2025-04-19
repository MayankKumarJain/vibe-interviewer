import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import MeetingContainer from "../components/Container";
import Card from "../components/Card";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const MeetingCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    maxWidth: "850px",
  },
}));

const ALLOW_AUDIO = true;
const ALLOW_VIDEO = true;
export default function Meeting() {
  // const [allowAudio, setAllowAudio] = useState(true);
  // const [allowVideo, setAllowVideo] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [interviewTitle, setInteriewTitle] = useState("Interview");
  const [interviewTime, setInterviewTime] = useState(new Date());
  const mediaStream = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSuccess = (stream: MediaStream) => {
    setIsAudioOn(true);
    setIsVideoOn(true);
    mediaStream.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const handleError = (error: Error) => {
    console.log("Handling Success!");
    // TODO: handle these 2 cases, how play/pause works would need to change
    if (error.name === "OverconstrainedError") {
      errorMsg(
        `OverconstrainedError: The constraints could not be satisfied by the available devices. Constraints: ${JSON.stringify(
          { audio: ALLOW_AUDIO, video: ALLOW_VIDEO }
        )}`
      );
    } else if (error.name === "NotAllowedError") {
      errorMsg(
        "NotAllowedError: Permissions have not been granted to use your camera and " +
          "microphone, you need to allow the page access to your devices in " +
          "order for the demo to work."
      );
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
  };

  const errorMsg = (msg: string, error?: Error) => {
    console.error(msg);
    if (typeof error !== "undefined") {
      console.error(error);
    }
  };

  const toggleVideo = () => {
    const videoTracks = mediaStream.current?.getVideoTracks();
    if (!videoTracks || !videoTracks?.length) return;
    for (var i = 0; i < videoTracks.length; ++i) {
      videoTracks[i].enabled = !videoTracks[i].enabled;
    }
    setIsVideoOn(!isVideoOn);
  };
  const toggleAudio = () => {
    const audioTracks = mediaStream.current?.getAudioTracks();
    if (!audioTracks || !audioTracks?.length) return;
    for (var i = 0; i < audioTracks.length; ++i) {
      audioTracks[i].enabled = !audioTracks[i].enabled;
    }
    setIsAudioOn(!isAudioOn);
  };

  useEffect(() => {
    if (ALLOW_AUDIO || ALLOW_VIDEO) {
      navigator.mediaDevices
        .getUserMedia({
          audio: ALLOW_AUDIO,
          video: ALLOW_VIDEO,
        })
        .then((stream) => handleSuccess(stream))
        .catch((e) => handleError(e));
    }
  }, []);

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
            ></video>
          </Paper>
        </Box>
      </MeetingCard>
    </MeetingContainer>
  );
}
