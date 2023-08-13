import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useParams } from 'react-router';


function AppLink() {

  document.title = "VCtalk";

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [using, setusing] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const onlinecall = useRef(null);
  const {linkpeerId}= useParams();

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {

      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (using === "call") {

        getUserMedia({ audio: true }, (mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          call.answer(mediaStream)

          call.on('stream', function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play();
          });
        });
      } else {

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          call.answer(mediaStream)

          call.on('stream', function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play();
          });
        });
      }

    });

    peer.on('close', () => {
      peer.disconnect();
      peer.destroy()
    });

    if(linkpeerId){
      Video(linkpeerId)
      console.log(linkpeerId)
    }

    peerInstance.current = peer;
  }, [using,linkpeerId])

  //end call 
  const EndCall = () => {
    if (onlinecall.current) {
      onlinecall.current.close();

    }
    const remoteVideo = document.querySelector('#remoteVideo');
    remoteVideo && remoteVideo.remove();

  }

  //voice call function
  const Call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)
      onlinecall.current = call;

      setusing("call")

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    })
  };

  //video call function
  const Video = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)
      onlinecall.current = call;

      setusing("video")

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    })
  };

  //copy user id
  const handleCopy = () => {
    navigator.clipboard.writeText(peerId);
  };

const sendLink = ()=>{
  
  
  if(window.location.port){
    navigator.clipboard.writeText(window.location.hostname+":"+window.location.port+"/"+peerId);
  }else{
    navigator.clipboard.writeText(window.location.hostname+"/"+peerId);
  }
}

  return (
    <div className="Link">
      <div>
        <h3>Current user id is {peerId}</h3>
      </div>
      <div>
        <button onClick={handleCopy}>Copy your id</button> <br></br>
        <button onClick={sendLink}>Copy your link</button> <br></br>
      </div>
      <div>
        <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
        <button onClick={async () => Call(remotePeerIdValue)} disabled hidden>Call</button>
        <button onClick={async () => Video(remotePeerIdValue)}>Video</button>

      </div>
      <div>
        <p>{using && "on " + using}</p>
      </div>
      <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} id="remoteVideo" />
      </div>
      <div>
        <button onClick={async () => EndCall()}>End</button>
      </div>
    </div>
  );
}

export default AppLink;