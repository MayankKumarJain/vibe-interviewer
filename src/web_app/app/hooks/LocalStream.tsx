import React, { useContext, createContext, useEffect, useRef } from "react";

const LoaclStreamContext = createContext<React.RefObject<MediaStream | null>>({
  current: null,
});
const LocalStream = ({ children }: { children: React.ReactNode }) => {
  const mediaStream = useRef<MediaStream | null>(null);

  return (
    <LoaclStreamContext.Provider value={mediaStream}>
      {children}
    </LoaclStreamContext.Provider>
  );
};

export default LocalStream;
export const useLocalStream = () => {
  return useContext(LoaclStreamContext);
};
