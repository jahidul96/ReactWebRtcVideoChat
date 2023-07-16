import React, { useContext } from "react";
import { CallContext } from "../context/CallContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function TopComp() {
  const {
    mySocketId,
    setCallerId,
    callUser,
    callaccepted,
    endCall,
    endedCall,
  } = useContext(CallContext);
  return (
    <div className="topContentWrapper">
      <input
        placeholder="paste caller id"
        className="inputStyle"
        onChange={(e) => setCallerId(e.target.value)}
      />

      {callaccepted && !endedCall ? (
        <button className="callBtn" onClick={() => endCall()}>
          End
        </button>
      ) : (
        <button className="callBtn" onClick={() => callUser()}>
          Call
        </button>
      )}

      <p>{mySocketId}</p>
      <CopyToClipboard
        className="callBtn"
        text={mySocketId}
        onCopy={() => setCallerId(mySocketId)}
      >
        <button className="callBtn">Copy</button>
      </CopyToClipboard>
    </div>
  );
}
