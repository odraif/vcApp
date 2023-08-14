import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useParams } from 'react-router';
import { MdCallEnd,MdLink,MdVideocam } from "react-icons/md";

function App() {

  document.title = "VCtalk";

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [using, setusing] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const onlinecall = useRef(null);
  const { linkpeerId } = useParams();

  useEffect(() => {
    const peer = new Peer();

    //get my peer id
    peer.on('open', (id) => {
      setPeerId(id)
    });

    // trigger on call
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

    //trigger on the end of the call
    peer.on('close', () => {
      peer.disconnect();
      peer.destroy()
    });

    if (linkpeerId) {
      Video(linkpeerId)
      console.log(linkpeerId)
    }

    peerInstance.current = peer;
  }, [using, linkpeerId])


  //trigger on the end of the call
  //peerInstance.current.on('close', () => {
  //peerInstance.current.disconnect();
  //peerInstance.current.destroy()
  //});

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

  //copy my link with my id
  const sendLink = () => {
    if (window.location.port) {
      navigator.clipboard.writeText(window.location.hostname + ":" + window.location.port + "/" + peerId);
    } else {
      navigator.clipboard.writeText(window.location.hostname + "/" + peerId);
    }
  }

  return (
    <div className="App">
      <div className='userid'>
        <h3>{peerId}</h3>
        <button onClick={sendLink}><MdLink></MdLink></button>
      </div>
      <div>
        <button onClick={handleCopy} hidden>Copy your id</button> <br></br>
        
      </div>
      <div className='callbyid'>
        <div className='input'>
          <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
        </div>
        <button onClick={async () => Call(remotePeerIdValue)} disabled hidden>Call</button>
        <button onClick={async () => Video(remotePeerIdValue)}><MdVideocam></MdVideocam></button>

      </div>
      <div>
        <p>{using && "on " + using}</p>
      </div>
      <div className='videoBox'>
        <div>
          <video ref={currentUserVideoRef} className="me" />
        </div>
        <div>
          <video ref={remoteVideoRef} id="remoteVideo" className="other" />
        </div>
      </div>
      <div className='functionbar'>
        <button onClick={async () => EndCall()}><MdCallEnd ></MdCallEnd></button>
      </div>
    </div>
  );
}

export default App;