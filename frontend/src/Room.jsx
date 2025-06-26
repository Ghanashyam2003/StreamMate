import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const Room = ({ roomID }) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000"); // ✅ Your backend port

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;

      socketRef.current.emit("join-call", roomID); // ✅ Match your backend

      socketRef.current.on("user-joined", (userID, usersInRoom) => {
        if (userID === socketRef.current.id) return;

        const peer = createPeer(userID, socketRef.current.id, stream);
        peersRef.current.push({ peerID: userID, peer });
        setPeers((prevPeers) => [...prevPeers, peer]);
      });

      socketRef.current.on("signal", (fromId, signal) => {
        const peerObj = peersRef.current.find((p) => p.peerID === fromId);
        if (peerObj) {
          peerObj.peer.signal(signal);
        } else {
          const peer = addPeer(signal, fromId, stream);
          peersRef.current.push({ peerID: fromId, peer });
          setPeers((prevPeers) => [...prevPeers, peer]);
        }
      });

      socketRef.current.on("user-left", (userID) => {
        const peerObj = peersRef.current.find((p) => p.peerID === userID);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        peersRef.current = peersRef.current.filter((p) => p.peerID !== userID);
        setPeers((prevPeers) => prevPeers.filter((p) => p.peerID !== userID));
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomID]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("signal", userToSignal, signal);
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("signal", callerID, signal);
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <h2>Room: {roomID}</h2>
      <video muted ref={userVideo} autoPlay playsInline style={{ width: "300px" }} />
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video playsInline autoPlay ref={ref} style={{ width: "300px" }} />;
};

export default Room;
