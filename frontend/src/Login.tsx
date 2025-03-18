import { Dispatch, SetStateAction, useEffect } from "react";

export default function Login({ 
    ws,
    setLogin,
    nameRef,
    roomRef
}: {
    ws: WebSocket, 
    setLogin: Dispatch<SetStateAction<boolean>> 
    nameRef:React.RefObject<HTMLInputElement | null>,
    roomRef: React.RefObject<HTMLInputElement | null>
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

    console.log(`Sending: ${name} to ${room}`);
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
    <div className="flex flex-col items-center justify-center p-6 pt-80 bg-gray-900 rounded-2xl shadow-lg space-y-4">
        <input
            placeholder="Enter name"
            ref={nameRef}
            className="w-60 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
            placeholder="Enter room ID"
            ref={roomRef}
            className="w-60 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            onClick={submitFn}
            className="w-60 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
            Submit
        </button>
    </div>

  );
}
