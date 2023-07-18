import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const App = () => {
  const [peer, setPeer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Create a new Peer object when the component mounts
    const peer = new Peer();

    // Set up event listeners for Peer object
    peer.on('open', () => {
      console.log('Connected to PeerServer with ID:', peer.id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Answer the incoming call and add local stream
          call.answer(stream);

          // Set up event listener for stream from remote peer
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    });

    setPeer(peer);

    return () => {
      // Clean up Peer object when the component unmounts
      peer.disconnect();
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    if (myStream && remoteVideoRef.current) {
      // Attach local stream to the video element
      const localVideo = document.getElementById('local-video');
      localVideo.srcObject = myStream;

      // Attach remote stream to the video element
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = remoteStream;
    }
  }, [myStream, remoteStream]);

  const handleCallClick = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set local stream
        setMyStream(stream);

        // Call the remote peer
        const call = peer.call('remote-peer-id', stream);

        // Set up event listener for stream from remote peer
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <h2>Local Video</h2>
        <video id="local-video" autoPlay muted playsInline />
      </div>
      <div>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={handleCallClick}>Call</button>
    </div>
  );
};

export default App;
