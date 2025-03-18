import {useEffect, useState } from 'react'
export default function Participants({ws}:{ws:WebSocket}){
    const [participants,setParticipants]=useState<string[]>([])
    
      useEffect(()=>{
        if(ws==null){return}
        ws.onmessage = (event) => {
          if(JSON.parse(event.data).type==='participant'){
            setParticipants([event.data])
          }
        }
      },[participants,ws])

      return (
        <div className='bg-emerald-950 text-white'>
            {participants.map(participant =>{
                const parsedParticipant=JSON.parse(participant)
                console.log(parsedParticipant)
                return parsedParticipant.name.map((n:string)=>{
                  return <p key={n}>{n}</p>
                })
            })}
        </div>
      )
}