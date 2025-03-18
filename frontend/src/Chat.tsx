import React,{useEffect,useRef,useState } from 'react'
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import Participants from './Participants';
export default function Chat({
    ws,
    setLogin,
    name,
    room
  }:
  {
    ws:WebSocket,
    setLogin:React.Dispatch<React.SetStateAction<boolean>>,
    name:string,
    room:string
  }){
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [messages,setMessages] = useState<string[]>([])
    const [participants,setParticipants]=useState<string[]>([])
    
    function submitFn(){
        if(inputRef.current==null || ws==null){return}
        const message=inputRef.current.value
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            "type":"chat",
            "payload":{
                "message":message,
                "name":name,
            }
          }))
        }
        inputRef.current.value=''
    }

    function logout(){
      console.log(name,room)
        ws.send(JSON.stringify({
          "type":"exit",
          "payload":{
              "room":room,
              "name":name
          }
      }))
        console.log("logged out called")
        setLogin(false)
    }
    
      useEffect(()=>{
        if(ws==null){return}
        ws.onmessage = (event) => {
          if(JSON.parse(event.data).type==='chat'){
            setMessages([...messages,event.data])
            console.log(event.data)
          }else if(JSON.parse(event.data).type==='participant'){
            setParticipants(JSON.parse(event.data).name)
          }
        }
      },[messages,ws])

      return (
        <div className="h-screen w-full flex bg-background"> 
          <Participants logout={logout} participants={participants}/>

          {/* Chat Section */}
        <div className="w-5/6 ml-80 flex flex-col">
        {/* Chat Header */}
        <div className="flex justify-between items-center mr-0 p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">WebSocket Chat App</h1>
          <Button className="bg-red-600 hover:bg-red-700" onClick={logout}>
            Log Out
          </Button>
        </div>

         {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages
              .filter(message => {
                const parsedMessage = JSON.parse(message);
                return parsedMessage.message && parsedMessage.message.trim() !== "";
              })
              .map((message, index) => {
                const parsedMessage = JSON.parse(message);
                return (
                  <div
                    key={index}
                    className="max-w-[80%] break-words rounded-lg p-3 bg-primary/10"
                  >
                    <p className="font-semibold text-sm text-primary">
                      {parsedMessage.name}
                    </p>
                    <p className="text-sm mt-1">{parsedMessage.message}</p>
                  </div>
                );
              })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
          <div className="flex space-x-2 max-w-[1200px] mx-auto">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              className="flex-1 border-black border-2 h-10"
              onKeyDown={(e) => e.key === 'Enter' && submitFn()}
            />
            <Button onClick={submitFn}>Send</Button>
          </div>
        </div>
      </div>
      </div>
    </div>
   )
}
