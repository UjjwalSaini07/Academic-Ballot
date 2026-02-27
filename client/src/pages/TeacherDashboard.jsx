import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import PollCard from "../components/PollCard";
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
    axios.get("http://localhost:5000/api/poll/active")
      .then(res => setPoll(res.data));
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
      duration
    });
  };

  const kick = (id) => {
    socket.emit("kick", id);
  };

  return (
    <div className="min-h-screen p-12">

      {!poll && (
        <div className="bg-white p-8 rounded-xl w-[600px] mx-auto shadow-sm">

          <h2 className="text-2xl font-bold mb-4">Let’s Get Started</h2>

          <input
            placeholder="Enter your question"
            className="border p-3 w-full mb-4 rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              className="border p-3 w-full mb-3 rounded"
              value={opt}
              onChange={(e) => {
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
            />
          ))}

          <button
            onClick={() => setOptions([...options, ""])}
            className="text-primary text-sm mb-4"
          >
            + Add option
          </button>

          <button
            onClick={createPoll}
            className="bg-primary text-white px-6 py-3 rounded-full"
          >
            Ask Question
          </button>

        </div>
      )}

      {poll && (
        <div className="flex flex-col items-center">

          <div className="flex justify-between w-[600px] mb-4">
            <button
              onClick={() => navigate("/history")}
              className="text-primary"
            >
              View Poll History
            </button>

            <button
              onClick={() => setShowParticipants(true)}
              className="text-primary"
            >
              Participants
            </button>
          </div>

          <PollCard poll={poll} />

          <button
            onClick={() => setPoll(null)}
            className="bg-primary text-white px-6 py-3 rounded-full mt-6"
          >
            + Ask a new question
          </button>

        </div>
      )}

      <ParticipantsModal
        open={showParticipants}
        participants={participants}
        onKick={kick}
        onClose={() => setShowParticipants(false)}
      />

      <ChatPopup socket={socket} />

    </div>
  );
}