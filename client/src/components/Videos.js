import React, { useContext } from "react";
import { CallContext } from "../context/CallContext";

export default function Videos() {
  const { stream, myVideo, callaccepted, userVideo, endedCall } =
    useContext(CallContext);
  return (
    <div className="notifyContainer">
      {stream && (
        <video
          ref={myVideo}
          autoPlay
          playsInline
          muted
          style={{ width: "300px", marginRight: "10px" }}
        />
      )}

      {callaccepted && userVideo ? (
        <video
          ref={userVideo}
          autoPlay
          playsInline
          style={{ width: "300px" }}
        />
      ) : null}
    </div>
  );
}
