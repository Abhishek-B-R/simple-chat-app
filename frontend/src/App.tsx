import "./App.css";
import { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Login from "./Login";

function App() {
  const [login, setLogin] = useState(false);
  const wsRef = useRef<WebSocket | null>(null); 
  const nameRef = useRef<HTMLInputElement>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://192.168.102.83:8080");

    wsRef.current.onopen = () => {
      console.log("WebSocket Connected");
      setWsConnected(true);
    }
    wsRef.current.onerror = (error) => console.error("WebSocket Error", error);
    wsRef.current.onclose = () => console.log("WebSocket Closed");

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!wsConnected) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {login ? <Chat ws={wsRef.current as WebSocket} nameRef={nameRef} setLogin={setLogin} /> : 
      <Login ws={wsRef.current as WebSocket} nameRef={nameRef} setLogin={setLogin} />}
    </div>
  );
}

export default App;
