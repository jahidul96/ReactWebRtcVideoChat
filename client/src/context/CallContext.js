import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Peer from "simple-peer";

export const CallContext = createContext();

const socket = io("http://localhost:4000");

export const CallContextProvider = ({ children }) => {
  const [mySocketId, setMySocketId] = useState("");
  const [callerId, setCallerId] = useState("");
  const [stream, setStream] = useState();
  const [callDetails, setCallDetails] = useState({});
  const [endedCall, setEndedCall] = useState(false);
  const [callaccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        if (!myVideo.current) return;
        myVideo.current.srcObject = stream;
      });

    // setting my id
    socket.on("myid", (id) => {
      setMySocketId(id);
    });

    // call recive
    socket.on("calluser", (data) => {
      setCallDetails({
        isRecivingCall: true,
        from: data.from,
        signal: data.signal,
      });
    });

    //   endcall

    socket.on("endcall", (data) => {
      setEndedCall(data);
      userVideo.current.srcObject = null;
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: callerId,
        from: mySocketId,
        signal: data,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    callDetails.isRecivingCall = false;
    setCallAccepted(callDetails);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answercall", { to: callDetails.from, signal: data });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(callDetails.signal);

    connectionRef.current = peer;
  };
  const endCall = () => {
    // connectionRef.current.destroy();
    setEndedCall(true);
    setCallAccepted(false);
    socket.emit("endcall", {
      to: callDetails.from ? callDetails.from : callerId,
      endedCall: true,
    });

    window.location.reload();
  };

  return (
    <CallContext.Provider
      value={{
        mySocketId,
        stream,
        callerId,
        setCallerId,
        endedCall,
        callDetails,
        callaccepted,
        myVideo,
        userVideo,
        answerCall,
        callUser,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
