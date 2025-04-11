import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ user, style }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  });

  return (
    <div>
      UID: {user.uid}
      <div ref={ref} style={style}></div>
    </div>
  );
};

export default VideoPlayer;
