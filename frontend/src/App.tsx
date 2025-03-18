import "./App.css";
import { useState, useEffect, useRef } from "react";
import Login from "./Login";
import Chat from "./Chat";

function App() {
  const [login, setLogin] = useState(false);
  const wsRef = useRef<WebSocket | null>(null); 
  const roomRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name,setName]=useState("")
  const [room, setRoom]=useState("")
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // wsRef.current = new WebSocket("wss://simple-chat-app-115i.onrender.com");
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("WebSocket Connected");
      setWsConnected(true);
    }
    wsRef.current.onerror = (error) => console.error("WebSocket Error", error);
    wsRef.current.onclose = () => console.log("WebSocket Closed");

    return () => {
        wsRef.current?.close();
    };
  }, []);

  if (!wsConnected) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {login ?
      <Chat ws={wsRef.current as WebSocket} name={name} room={room} setLogin={setLogin} /> : 
      <Login ws={wsRef.current as WebSocket} setName={setName} setRoom={setRoom}
       nameRef={nameRef} roomRef={roomRef} setLogin={setLogin} />}
    </div>
  );
}

export default App;
