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
        const parsedMessage = JSON.parse(e.toString());

        try{
            const roomId=parsedMessage.payload.room
            const name=parsedMessage.payload.name
            if(parsedMessage.type==="join"){

                allSocket.push({
                    socket,
                    room:roomId,
                    name:name
                })

                const allNames: string[] = []
                allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                    allNames.push(e.name.trim().toLowerCase())
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

                allSocket.filter(e=>e.socket===socket)
                allSocket.filter((e)=>e.room===roomId).forEach((e)=>{
                    e.socket.send(JSON.stringify({
                        type:"chat",
                        message:parsedMessage.payload.message,
                        name
                    }))
                })
            }else if(parsedMessage.type==="exit"){
                
                const roomId=parsedMessage.payload.room
                const name=parsedMessage.payload.name

                // console.log(name,roomId)

                allSocket=allSocket.filter((e)=>{
                    return !(e.room===roomId && e.name===name)
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
            }else if(parsedMessage.type==="allNames"){
                const allNames:string[] = []
                allSocket.forEach((e)=>{
                    allNames.push(e.name)
                })
                socket.send(JSON.stringify(allNames))
            }
            else{
                console.log("Unknown type of message")
            }

            socket.on("close", () => {
                allSocket=allSocket.filter(e=>e.socket!==socket);

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
            });
        }catch(e){
            console.log("Some error while parsing, check your JSON data")
        }
    })

})