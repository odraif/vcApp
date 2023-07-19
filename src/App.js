import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';


function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const onlinecall = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
      
     
    })

    peer.on('close', () => {
      alert("the call is closed")
    });
    
    peerInstance.current = peer;
  }, [])

  const EndCall = ()=>{
    if(onlinecall.current){
      onlinecall.current.close();
    }
  }

  const Call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({  audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)
      onlinecall.current = call;

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    })};


    const Video = (remotePeerId) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
      getUserMedia({  video: true, audio: true }, (mediaStream) => {
  
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
  
        const call = peerInstance.current.call(remotePeerId, mediaStream)
        onlinecall.current = call;

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream
        });
      })};

      const handleCopy = () => {
        navigator.clipboard.writeText(peerId); // copy text to clipboard
      };
    

  return (
    <div className="App">
      <h3>Current user id is {peerId}</h3>
      <button onClick={handleCopy}>Copy your id</button> <br></br>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => Call(remotePeerIdValue)}>Call</button>
      <button onClick={() => Video(remotePeerIdValue)}>Video</button>
      <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
      <div>
        <button onClick={async ()=> EndCall()}>End</button>
      </div>
    </div>
  );
}

export default App;