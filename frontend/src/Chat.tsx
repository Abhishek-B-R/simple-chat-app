import React,{useEffect,useRef,useState } from 'react'
export default function Chat({
    ws,
    setLogin,
    nameRef
  }:
  {
    ws:WebSocket,
    setLogin:React.Dispatch<React.SetStateAction<boolean>>,
    nameRef:React.RefObject<HTMLInputElement | null>
  }){
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [messages,setMessages] = useState<string[]>([])
    const [name]=useState(nameRef.current?.value)
    
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

    function handleKeyPress(e:KeyboardEvent){
        if(e.key==="Enter"){
        submitFn()
        }
    }

    function logout(){
        setLogin(false)
    }
    
    useEffect(()=>{
        document.addEventListener('keydown', handleKeyPress);
      })
    
      useEffect(()=>{
        if(ws==null){return}
        ws.onmessage = (event) => {
          setMessages([...messages,event.data])
        }
      },[messages,ws])

      return (
        <div className='ml-96 pl-96 mt-0 '>
          <h1 className='h-10 font-semibold p-10'>WebSocket Chat App</h1>
          <button onClick={logout} className='bg-amber-600 text-black p-2 '>LogOut</button>
          <div>
            <h2 className='text-2xl p-10'>Messages:</h2>
            {messages.filter(message => {
              const parsedMessage=JSON.parse(message)
              return parsedMessage.message && parsedMessage.message.trim() !== ""
            }) 
            .map((message,index) => {
              const parsedMessage=JSON.parse(message)
              return <p className='bg-white text-zinc-800 max-w-80 border-2 p-2' 
              key={index}>{parsedMessage.name}: {parsedMessage.message}</p>
            })}
          </div>
          <div className='font-bold'>
            <input type="text" ref={inputRef} placeholder="Enter your message" className='bg-black text-white h-10'/>
            <button onClick={submitFn} className='bg-amber-500 w-20 h-10 ml-2'>Submit</button>
          </div>
        </div>
      )
}