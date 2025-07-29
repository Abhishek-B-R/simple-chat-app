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
    let retries = 0;
    const maxRetries = 10;
    const retryInterval = 3000;

    async function waitForWebSocket(url:string) {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log("WebSocket Connected 🎉");
          resolve(ws);
        };

        ws.onerror = (error) => {
          console.error("WebSocket Error", error);
          reject(error);
        };

        ws.onclose = () => {
          console.log("WebSocket Closed");
        };      
      });
    }

    async function connectWebSocket() {
      while (retries < maxRetries) {
        try {
          console.log(`Attempting connection... (${retries + 1}/${maxRetries})
            The backend has to be cold restarted, it might take upto 40-50sec please wait`);
          wsRef.current = await waitForWebSocket("wss://api.chat.abhi.wtf") as WebSocket;
          setWsConnected(true);
          return; // Exit loop on successful connection
        } catch (e) {
          retries++;
          console.log(`Retrying in ${retryInterval / 1000} seconds...+${e}`);
          await new Promise((res) => setTimeout(res, retryInterval));
        }
      }
      console.error("Max retries reached. WebSocket connection failed.");
    }

    connectWebSocket();

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
