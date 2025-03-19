import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area"
import { Separator } from "./components/ui/separator"
import { Users, LogOut } from "lucide-react";
export default function Participants({logout,participants,name}:
  {logout:()=>void,participants: string[],name:string})
  {
      return (
        <div className='bg-emerald-900 text-white fixed h-full hidden md:block'>
            <div className="w-72 border-r flex flex-col">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <h2 className="font-semibold">Participants</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {participants.map((participant, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg bg-muted/20 text-sm font-medium"
                    >
                      {participant===name?participant+" (You)":participant}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
        </div>

        
      )
}