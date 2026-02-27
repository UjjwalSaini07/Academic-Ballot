import { useState, useEffect, useCallback } from "react";
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
  const [correctOption, setCorrectOption] = useState(-1);
  const [poll, setPoll] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch active poll
  const fetchPoll = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/poll/active");
      setPoll(res.data);
    } catch (err) {
      setPoll(null);
    }
  }, []);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/poll/participants");
      setParticipants(res.data);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  }, []);

  // Initial fetch and periodic polling as fallback
  useEffect(() => {
    fetchPoll();
    fetchParticipants();
    const pollInterval = setInterval(() => {
      fetchPoll();
      fetchParticipants();
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [fetchPoll, fetchParticipants]);

  useEffect(() => {
    if (!socket) return;

    const handleParticipants = (data) => setParticipants(data);
    const handlePollCreated = (newPoll) => {
      setPoll(newPoll);
      setIsCreating(false);
      // Also reset form
      setQuestion("");
      setOptions(["", ""]);
      setDuration(60);
      setCorrectOption(-1);
    };
    const handleVoteUpdate = (updatedPoll) => setPoll(updatedPoll);
    const handleError = (msg) => {
      alert(msg);
      setIsCreating(false);
    };

    socket.on("participants", handleParticipants);
    socket.on("poll_created", handlePollCreated);
    socket.on("vote_update", handleVoteUpdate);
    socket.on("error_message", handleError);

    return () => {
      socket.off("participants", handleParticipants);
      socket.off("poll_created", handlePollCreated);
      socket.off("vote_update", handleVoteUpdate);
      socket.off("error_message", handleError);
    };
  }, [socket]);

  const createPoll = async () => {
    // Validate inputs
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }
    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (filledOptions.length < 2) {
      alert("Please add at least 2 options");
      return;
    }

    setIsCreating(true);

    // Try socket first
    if (socket) {
      socket.emit("create_poll", {
        question,
        options: filledOptions,
        duration,
        correctOption,
      });
    } else {
      // Fallback to HTTP
      try {
        const res = await axios.post("http://localhost:5000/api/poll", {
          question,
          options: filledOptions,
          duration,
          correctOption,
        });
        setPoll(res.data);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to create poll");
      }
      setIsCreating(false);
    }
  };

  const kick = (id) => {
    socket.emit("kick", id);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center pt-16 relative">
      {!poll && (
        <div className="w-full max-w-[900px] mx-auto pt-7 pb-20 px-4">
          <div
            className="inline-block px-4 py-1 text-xs font-medium 
    bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF] 
    text-white rounded-full mb-6"
          >
            ✦ Intervue Poll
          </div>

          <h2 className="text-[32px] font-semibold mb-2">Let’s Get Started</h2>

          <p className="text-gray-500 text-[15px] mb-10 max-w-[650px]">
            you’ll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>

          <div className="flex justify-between items-center mb-4">
            <label className="text-[15px] font-medium">
              Enter your question
            </label>

            <div className="relative">
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-[#EAEAF3] px-4 py-2 rounded-[8px] text-sm 
          appearance-none pr-8 outline-none"
              >
                <option value={30}>30 seconds</option>
                <option value={45}>45 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
              </select>
              <span className="absolute right-3 top-2 text-[#6D5DF6]">▼</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              maxLength={100}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-[120px] bg-[#EAEAF3] rounded-[8px] 
        p-4 text-[14px] outline-none resize-none"
            />
            <span className="absolute bottom-3 right-4 text-xs text-gray-500">
              {question.length}/100
            </span>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[15px] mb-6">Edit Options</h3>

              <div className="space-y-4">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded-full bg-[#6D5DF6] text-white 
              flex items-center justify-center text-xs font-medium"
                    >
                      {i + 1}
                    </div>

                    <input
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[i] = e.target.value;
                        setOptions(copy);
                      }}
                      className="flex-1 h-[42px] bg-[#EAEAF3] 
                rounded-[8px] px-4 text-sm outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOptions([...options, ""])}
                className="mt-6 px-4 py-2 border border-[#6D5DF6] 
          text-[#6D5DF6] text-sm rounded-[8px]"
              >
                + Add More option
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-[15px] mb-6">Is it Correct?</h3>

              <div className="space-y-4">
                {options.map((_, i) => (
                  <div key={i} className="flex items-center gap-6 h-[42px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={correctOption === i}
                        onChange={() => setCorrectOption(i)}
                        className="accent-[#6D5DF6]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={correctOption !== i}
                        onChange={() =>
                          setCorrectOption(
                            correctOption === i ? -1 : correctOption,
                          )
                        }
                      />
                      <span className="text-sm text-gray-500">No</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-16">
            <button
              onClick={createPoll}
              disabled={isCreating}
              className="px-12 py-3 rounded-full text-white text-sm font-medium
        bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]
        shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Ask Question"}
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

                // Check if answer is revealed (teacher always sees the correct answer they selected)
                const showAnswer = poll.showAnswer === true;
                const hasCorrectSet = poll.correctOption !== undefined && poll.correctOption >= 0;
                const isCorrect = hasCorrectSet && poll.correctOption === index;
                const isWrong = hasCorrectSet && poll.correctOption !== index;

                return (
                  <div
                    key={index}
                    className={`relative h-[44px] rounded-[8px] border overflow-hidden ${
                      showAnswer && isCorrect
                        ? "border-green-500 bg-green-50"
                        : showAnswer && isWrong
                          ? "border-red-200 bg-red-50"
                          : hasCorrectSet
                            ? "border-green-500 bg-green-50"
                            : "border-[#D9D9E8] bg-white"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                        showAnswer
                          ? isCorrect
                            ? "bg-green-500"
                            : "bg-red-300"
                          : hasCorrectSet
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
                      }`}
                      style={{ width: `${percent}%` }}
                    />

                    <div className="relative flex items-center justify-between h-full px-4 text-[14px]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : isWrong
                                ? "bg-red-300 text-white"
                                : "bg-[#6D5DF6] text-white"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <span
                          className={`font-medium ${
                            isCorrect
                              ? "text-green-700"
                              : isWrong
                                ? "text-red-700"
                                : ""
                          }`}
                        >
                          {opt}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-[2px] rounded-[6px] text-[12px] font-semibold ${
                          isCorrect
                            ? "bg-green-500 text-white"
                            : isWrong
                              ? "bg-red-300 text-white"
                              : "bg-white border border-[#6D5DF6] text-[#6D5DF6]"
                        }`}
                      >
                        {percent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-4">
            {(!poll.showAnswer) && poll.correctOption >= 0 && (
              <button
                onClick={async () => {
                  if (poll?._id && poll.correctOption >= 0) {
                    try {
                      const res = await axios.put(
                        `http://localhost:5000/api/poll/${poll._id}/reveal`,
                        { correctOption: poll.correctOption }
                      );
                      setPoll(res.data);
                    } catch (err) {
                      console.error("Failed to reveal answer:", err);
                    }
                  } else {
                    alert("Please select the correct answer when creating the poll");
                  }
                }}
                className="px-6 py-3 rounded-full text-white font-medium bg-green-500 hover:bg-green-600 shadow-md transition"
              >
                Reveal Answer
              </button>
            )}
            <button
              onClick={async () => {
                if (poll?._id) {
                  try {
                    await axios.put(
                      `http://localhost:5000/api/poll/${poll._id}/complete`,
                    );
                  } catch (err) {
                    console.error("Failed to complete poll:", err);
                  }
                }
                setPoll(null);
              }}
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
