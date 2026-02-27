import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import ParticipantsModal from "../components/ParticipantsModal";
import ChatPopup from "../components/ChatPopup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const socket = useSocket();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [poll, setPoll] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/poll/active")
      .then((res) => setPoll(res.data));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("participants", setParticipants);
    socket.on("poll_created", setPoll);
    socket.on("vote_update", setPoll);
  }, [socket]);

  const createPoll = () => {
    socket.emit("create_poll", {
      question,
      options,
      duration,
    });
  };

  const kick = (id) => {
    socket.emit("kick", id);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center pt-16 relative">
      {!poll && (
        <div className="w-[720px] bg-white rounded-[16px] shadow-sm border border-[#E2E2E8] p-8">
          <div className="inline-block px-4 py-1 text-xs font-medium bg-[#6D5DF6] text-white rounded-full mb-6">
            Intervue Poll
          </div>

          <h2 className="text-2xl font-semibold mb-2">Let’s Get Started</h2>

          <p className="text-gray-500 text-sm mb-6">
            Create a question and let students vote live.
          </p>

          <label className="text-sm font-medium">Enter your question</label>

          <textarea
            className="w-full mt-2 h-28 rounded-lg border border-[#D9D9E8] px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#6D5DF6]"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="mt-8 space-y-4">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </div>

                <input
                  className="flex-1 border border-[#D9D9E8] rounded-lg h-11 px-3 text-sm focus:outline-none focus:border-[#6D5DF6]"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const copy = [...options];
                    copy[i] = e.target.value;
                    setOptions(copy);
                  }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setOptions([...options, ""])}
            className="text-[#6D5DF6] text-sm mt-4"
          >
            + Add option
          </button>

          <div className="mt-8">
            <label className="text-sm font-medium">Duration (seconds)</label>

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-32 mt-2 border border-[#D9D9E8] rounded-lg h-10 px-3 text-sm focus:outline-none focus:border-[#6D5DF6]"
            />
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={createPoll}
              className="px-12 py-3 rounded-full text-white text-sm font-medium
              bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]
              shadow-md hover:opacity-95 transition"
            >
              Ask Question
            </button>
          </div>
        </div>
      )}

      {poll && (
        <div className="w-[720px]">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate("/history")}
              className="text-[#6D5DF6] text-sm font-medium"
            >
              View Poll History
            </button>

            <button
              onClick={() => setShowParticipants(true)}
              className="text-[#6D5DF6] text-sm font-medium"
            >
              Participants ({participants.length})
            </button>
          </div>

          <h2 className="text-[18px] font-semibold mb-3">Question</h2>

          <div className="rounded-[12px] border border-[#CFCFE3] overflow-hidden bg-white">
            <div className="bg-[#4A4A4A] text-white px-5 py-3 text-[14px] font-medium">
              {poll.question}
            </div>

            <div className="p-4 space-y-3">
              {poll.options.map((opt, index) => {
                const totalVotes = poll.results.reduce(
                  (a, b) => a + b.votes,
                  0,
                );
                const votes = poll.results[index]?.votes || 0;
                const percent =
                  totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

                return (
                  <div
                    key={index}
                    className="relative h-[44px] rounded-[8px] border border-[#D9D9E8] overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
                      style={{ width: `${percent}%` }}
                    />

                    <div className="relative flex items-center justify-between h-full px-4 text-[14px]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center text-[12px] font-medium">
                          {index + 1}
                        </div>

                        <span className="font-medium">{opt}</span>
                      </div>

                      <div className="bg-white border border-[#6D5DF6] text-[#6D5DF6] px-3 py-[2px] rounded-[6px] text-[12px] font-semibold">
                        {percent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPoll(null)}
              className="px-6 py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF] shadow-md hover:opacity-90 transition"
            >
              + Ask a new question
            </button>
          </div>
        </div>
      )}

      <ParticipantsModal
        open={showParticipants}
        participants={participants}
        onKick={kick}
        onClose={() => setShowParticipants(false)}
      />

      <ChatPopup socket={socket} participants={participants} onKick={kick} />
    </div>
  );
}
