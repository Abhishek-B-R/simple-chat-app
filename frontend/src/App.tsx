import "./App.css";
import { useState, useEffect, useRef } from "react";
import Participants from "./Participants";
import Login from "./Login";
// import Chat from "./Chat";

function App() {
  const [login, setLogin] = useState(false);
  const wsRef = useRef<WebSocket | null>(null); 
  const roomRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("WebSocket Connected");
      setWsConnected(true);
    }
    wsRef.current.onerror = (error) => console.error("WebSocket Error", error);
    wsRef.current.onclose = () => console.log("WebSocket Closed");

    const roomRefVal=roomRef.current
    const nameRefVal=nameRef.current
    return () => {
      const ws=wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          "type":"exit",
          "payload":{
              "room":roomRefVal,
              "name":nameRefVal,
          }
        }))
        ws.close();
      }
    };
  }, []);

  if (!wsConnected) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <Chat ws={wsRef.current as WebSocket} nameRef={nameRef} setLogin={setLogin} /> :  */}
      {login ?
      <Participants ws={wsRef.current as WebSocket}/> :
      <Login ws={wsRef.current as WebSocket} nameRef={nameRef} roomRef={roomRef} setLogin={setLogin} />}
      
    </div>
  );
}

export default App;
