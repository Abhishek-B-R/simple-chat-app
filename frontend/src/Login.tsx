import { Dispatch, SetStateAction, useEffect } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Login({ 
    ws,
    setLogin,
    nameRef,
    roomRef,
    setName,
    setRoom
}: {
    ws: WebSocket, 
    setLogin: Dispatch<SetStateAction<boolean>> 
    nameRef:React.RefObject<HTMLInputElement | null>,
    roomRef: React.RefObject<HTMLInputElement | null>,
    setName:React.Dispatch<React.SetStateAction<string>>,
    setRoom: React.Dispatch<React.SetStateAction<string>>
}) {

  function submitFn() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open");
      return;
    }

    const name = nameRef.current?.value;
    const room = roomRef.current?.value;

    if (!name || !room) {
      console.error("Name and Room are required");
      return;
    }

    // console.log(`Sending: ${name} to ${room}`);
    setName(name)
    setRoom(room)
    ws.send(
      JSON.stringify({
        type: "join",
        payload: {
          room,
          name,
        },
      })
    );
    setLogin(true);
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      submitFn();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }); // Add cleanup

  return (
    <div className="min-h-screen  w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="w-[400px] p-6 space-y-6">
        <div className="space-y-2 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Chat</h1>
          <p className="text-sm text-muted-foreground">Enter your details to join a room</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Your name"           
              ref={nameRef}

            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Room number"
              ref={roomRef}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={submitFn}
            // disabled={!nameRef.current?.value || !roomRef.current?.value}
          >
            Join Room
          </Button>
        </div>
      </Card>
    </div>

  );
}
