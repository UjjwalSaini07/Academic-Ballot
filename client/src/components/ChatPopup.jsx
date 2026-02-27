import { useState, useEffect } from "react";

export default function ChatPopup({ socket, participants = [], onKick }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat_message", handler);

    return () => {
      socket.off("chat_message", handler);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !input.trim()) return;
    socket.emit("chat_message", input);
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  // Safe access to participants array
  const safeParticipants = Array.isArray(participants) ? participants : [];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {open && (
        <div className="mb-4 w-[340px] bg-white rounded-xl shadow-2xl border border-[#E2E2E8] overflow-hidden">
          <div className="flex border-b border-[#E2E2E8] text-sm">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 ${
                activeTab === "chat"
                  ? "border-b-2 border-[#6D5DF6] text-[#6D5DF6] font-medium"
                  : "text-gray-500"
              }`}
            >
              Chat
            </button>

            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 py-3 ${
                activeTab === "participants"
                  ? "border-b-2 border-[#6D5DF6] text-[#6D5DF6] font-medium"
                  : "text-gray-500"
              }`}
            >
              Participants
            </button>
          </div>

          <div className="h-[260px] overflow-y-auto p-4 text-sm">
            {activeTab === "chat" && (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 px-3 py-2 rounded-lg w-fit"
                  >
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "participants" && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Name</span>
                  <span>Action</span>
                </div>

                {safeParticipants.length > 0 ? (
                  safeParticipants.map((user, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{user?.name || user}</span>

                      {onKick && (
                        <button
                          onClick={() => onKick(user?.name || user)}
                          className="text-[#6D5DF6] text-xs font-medium hover:underline"
                        >
                          Kick out
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center mt-6">
                    No participants
                  </p>
                )}
              </div>
            )}
          </div>

          {activeTab === "chat" && (
            <div className="flex gap-2 p-3 border-t border-[#E2E2E8]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6D5DF6]"
                placeholder="Type a message..."
              />

              <button
                onClick={sendMessage}
                className="px-4 rounded-lg text-white text-sm
                bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full
        bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]
        text-white shadow-xl flex items-center justify-center text-xl
        hover:scale-105 transition"
      >
        💬
      </button>
    </div>
  );
}
