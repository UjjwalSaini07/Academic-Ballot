import { useState } from "react";

export default function ChatPopup({ socket }) {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  socket?.on("chat_message", (msg) => {
    setMessages(prev => [...prev, msg]);
  });

  const send = () => {
    socket.emit("chat_message", input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6">

      {open && (
        <div className="bg-white w-80 h-96 shadow-lg rounded-xl p-4 mb-2 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className="mb-2 text-sm">{m}</div>
            ))}
          </div>
          <input
            className="border p-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={send} className="bg-primary text-white mt-2 p-2 rounded">
            Send
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-primary text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

    </div>
  );
}