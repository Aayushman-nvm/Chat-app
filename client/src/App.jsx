import { useEffect, useState } from 'react'
import './App.css'
import { useRef } from 'react';

function App() {
  const [socket, setSocket]=useState();
  const inputRef=useRef();

  function sendMessage() {
    const message=inputRef.current.value;
    socket.send(message);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setSocket(ws);
    ws.onmessage = (e) => {
      alert(e.data);
    }
  }, []);

  return (
    <>
      <div>
        <input ref={inputRef} type='text' placeholder='Message' />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  )
}

export default App
