import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { useLocalStream } from "../hooks/localStream";

//TODO: Remove place holder, connect with websocket server

// TODO: Update config.json #CONFIG
const WEB_RTC_SERVER_LINK = "ws://localhost:8080/start_web_socket";

const usePeerConnection = () => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useLocalStream();
  const remoteStream = useRef<MediaStream | null>(null);
  const [isRemoteStreamReady, setIsRemoteStreamReady] = useState(false);
  const { meetingId } = useParams();
  const { userId } = useAuth();
  const url = new URL(
    `${WEB_RTC_SERVER_LINK}?userId=${userId}&meetingId=${meetingId}`
  );
  const socket = useRef(new WebSocket(url));

  useEffect(() => {
    // READY State
    const pc = new RTCPeerConnection();
    peerConnection.current = pc;
    pc.onicecandidate = (e) => {
      if(e.candidate) pc.addIceCandidate(e.candidate);
    };

    pc.ontrack = (e) => {
      remoteStream.current = e.streams[0];
      setIsRemoteStreamReady(true);
    };
    if (localStream.stream)
      localStream.stream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream.stream!));

    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      console.log("Sending data offer from FE");
      console.log({ type: "offer", sdp: offer.sdp });
      socket.current.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
    });

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (event.data.type === "answer") {
        peerConnection.current?.setRemoteDescription(event.data);
      }
    };
  }, [localStream.ready]);

  return { peerConnection, remoteStream, isRemoteStreamReady };
};
export default usePeerConnection;
