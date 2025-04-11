import React, { useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import VideoRoom from "./VideoRoom";

function VideoChat({ onClose }) {
  const modalRef = useRef();
  const [joined, setjoined] = useState(false);

  const handleClose = () => {
    setjoined(false);
    onClose();
  };

  return (
    <div ref={modalRef} className="modal">
      <div className="flex flex-col items-center justify-center gap-0 text-white bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4">
        <button
          onClick={handleClose}
          className="place-self-end border-none bg-gray-600 m-0 p-0"
        >
          <FaXmark size={20} color="white" />
        </button>
        <h2 className="left-align mx-10">Video Chat</h2>
        {!joined && <button onClick={() => setjoined(true)}>Join Room</button>}

        {joined && (
          <>
            <button onClick={() => setjoined(false)}>Leave Stream</button>
            <VideoRoom />
          </>
        )}
      </div>
    </div>
  );
}

export default VideoChat;
