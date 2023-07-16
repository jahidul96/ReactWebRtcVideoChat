import React, { useContext } from "react";
import { CallContext } from "../context/CallContext";

export default function CallNotify() {
  const { callDetails, answerCall } = useContext(CallContext);
  return (
    <>
      {callDetails.isRecivingCall ? (
        <div className="notifyContainer">
          <p>{callDetails.from} is calling</p>
          <button className="callBtn" onClick={() => answerCall()}>
            Accept
          </button>
        </div>
      ) : null}
    </>
  );
}
