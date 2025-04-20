import React, {
  useContext,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

const LoaclStreamContext = createContext<{
  stream: MediaStream | null;
  ready: boolean;
  close: () => void;
}>({
  stream: null,
  ready: false,
  close: () => {},
});

const ALLOW_AUDIO = true;
const ALLOW_VIDEO = true;
const LocalStream = ({ children }: { children: React.ReactNode }) => {
  const mediaStream = useRef<MediaStream | null>(null);
  const [isLocalStreamReady, setIsLocalStreamReady] = useState(false);

  const handleSuccess = (stream: MediaStream) => {
    mediaStream.current = stream;
    setIsLocalStreamReady(true);
  };

  const handleError = (error: Error) => {
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

  const closeStream = () => {
    setIsLocalStreamReady(false);
    if (!mediaStream.current) return;
    mediaStream.current.getTracks().forEach((track) => track.stop());
    mediaStream.current = null;
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
    <LoaclStreamContext.Provider
      value={{
        stream: mediaStream.current,
        ready: isLocalStreamReady,
        close: closeStream,
      }}
    >
      {children}
    </LoaclStreamContext.Provider>
  );
};

export default LocalStream;
export const useLocalStream = () => {
  return useContext(LoaclStreamContext);
};
