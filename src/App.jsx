import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "me",
    };
    setMessage("");
    setMessages([newMessage, ...messages]);
  };

  useEffect(() => {
    const recieveMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on("message", recieveMessage);
    return () => {
      socket.off("message", recieveMessage);
    };
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form className="bg-zinc-900 p-10" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold my-2">Chat React</h1>
        <input
          className="border-2 border-zinc-500 p-2 text-black w-full"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ul className="h-80 w-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`rounded-md table p-2 my-2 ${
                message.from === "me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              <p>
                {message.from} : {message.body}
              </p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
