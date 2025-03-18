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
            const roomId=parsedMessage.payload.room
            const name=parsedMessage.payload.name

            allSocket.push({
                socket,
                room:roomId,
                name:name
            })
            const allNames: string[] = []
            allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                allNames.push(e.name)
            })

            allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                e.socket.send(JSON.stringify({
                    type:"participant",
                    name:allNames
                }))
            })
        }else if(parsedMessage.type==="chat"){
            const roomId=allSocket.find(e=>e.socket===socket)?.room
            const name=allSocket.find(e=>e.name===parsedMessage.payload.name)?.name

            if(!name)   return;
            console.log(allSocket)

            allSocket.filter(e=>e.socket===socket)
            allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                e.socket.send(JSON.stringify({
                    type:"chat",
                    message:parsedMessage.payload.message,
                    name
                }))
            })
        }
    })
})