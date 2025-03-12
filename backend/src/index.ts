import { WebSocketServer,WebSocket } from "ws";

const wss=new WebSocketServer({port:8080});

interface allSocketType{
    socket:WebSocket,
    room:string,
    name:string
}
let allSocket:allSocketType[]=[]

wss.on("connection",(socket:WebSocket)=>{
    socket.on("message",(e)=>{
        const parsedMessage= JSON.parse(e.toString())
        if(parsedMessage.type==="join"){
            allSocket.push({
                socket,
                room:parsedMessage.payload.room,
                name:parsedMessage.payload.name
            })
        }else if(parsedMessage.type==="chat"){
            const roomId=allSocket.find(e=>e.socket===socket)?.room
            const name=allSocket.find(e=>e.name===parsedMessage.payload.name)?.name

            if(!name)   return;

            allSocket.filter(e=>e.socket===socket)
            allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                e.socket.send(JSON.stringify({
                    message:parsedMessage.payload.message,
                    name
                }))
            })
        }
    })
})