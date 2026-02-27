import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSocket } from "../hooks/useSocket";
import { usePollTimer } from "../hooks/usePollTimer";
import PollCard from "../components/PollCard";
import ChatPopup from "../components/ChatPopup";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const socket = useSocket();
  const navigate = useNavigate();
  const name = sessionStorage.getItem("studentName");

  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [kicked, setKicked] = useState(false);

  // Fetch active poll
  const fetchPoll = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/poll/active");
      setPoll(res.data);
    } catch (err) {
      setPoll(null);
    }
  }, []);

  const checkKicked = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/poll/check-kicked", {
        params: { name }
      });
      if (res.data.isKicked) {
        setKicked(true);
        setTimeout(() => navigate("/student"), 3000);
      }
    } catch (err) {
      // Not kicked or error
    }
  }, [name, navigate]);

  // Call usePollTimer at the top level to follow Rules of Hooks
  const timeLeft = usePollTimer(poll?.startTime || 0, poll?.duration || 0);

  // Initial fetch and periodic polling as fallback
  useEffect(() => {
    checkKicked();
    fetchPoll();
    const interval = setInterval(() => {
      fetchPoll();
    }, 7000); // Poll every 3 seconds as fallback
    return () => clearInterval(interval);
  }, [fetchPoll, checkKicked]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", name);

    // Handle new poll created
    const handlePollCreated = (newPoll) => {
      setPoll(newPoll);
      setVoted(false);
    };

    // Handle poll ended
    const handlePollEnded = () => {
      setPoll(null);
      setVoted(false);
    };

    // Handle vote updates
    const handleVoteUpdate = (updatedPoll) => {
      setPoll(updatedPoll);
    };

    // Handle answer revealed
    const handleAnswerRevealed = (updatedPoll) => {
      setPoll(updatedPoll);
    };

    // Handle kicked
    const handleKicked = () => {
      setKicked(true);
      setTimeout(() => {
        navigate("/student");
      }, 3000);
    };

    const handleError = (msg) => {
      if (msg === "Time expired") {
        fetchPoll();
      } else {
        console.error("Socket error:", msg);
      }
    };

    socket.on("poll_created", handlePollCreated);
    socket.on("poll_ended", handlePollEnded);
    socket.on("vote_update", handleVoteUpdate);
    socket.on("answer_revealed", handleAnswerRevealed);
    socket.on("kicked", handleKicked);
    socket.on("error_message", handleError);

    return () => {
      socket.off("poll_created", handlePollCreated);
      socket.off("poll_ended", handlePollEnded);
      socket.off("vote_update", handleVoteUpdate);
      socket.off("answer_revealed", handleAnswerRevealed);
      socket.off("kicked", handleKicked);
      socket.off("error_message", handleError);
    };
  }, [socket, name, fetchPoll]);

  if (kicked) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center text-sm font-medium">
            {name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <div className="mb-6">
          <span
            className="px-4 py-1 text-xs font-medium rounded-full text-white 
          bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
          >
            ✦ Intervue Poll
          </span>
        </div>

        <h2 className="text-[28px] font-semibold text-center">
          You’ve been Kicked out !
        </h2>

        <p className="text-gray-500 text-sm text-center mt-3 max-w-[420px] leading-relaxed">
          Looks like the teacher had removed you from the poll system. Please
          Try again sometime.
        </p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center text-sm font-medium">
            {name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>

        <div className="mb-6">
          <span
            className="px-4 py-1 text-xs font-medium rounded-full text-white 
            bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
          >
            ✦ Intervue Poll
          </span>
        </div>

        <div className="mb-6">
          <div className="w-14 h-14 border-4 border-[#6D5DF6] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-[22px] font-semibold text-center">
          Wait for the teacher to ask questions..
        </h2>
      </div>
    );
  }

  const vote = (index) => {
    if (!socket) return;
    socket.emit("vote", {
      pollId: poll._id,
      studentName: name,
      optionIndex: index,
    });
    setVoted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center pt-20 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
        <div className="w-8 h-8 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center text-sm font-medium">
          {name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>

      {poll && (
        <div className="w-[720px]">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[16px] font-semibold">Question 1</h2>

            <div className="flex items-center gap-1 text-red-500 text-sm font-semibold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              00:{String(timeLeft).padStart(2, "0")}
            </div>
          </div>

          <PollCard
            poll={poll}
            onVote={vote}
            voted={voted}
            timeLeft={timeLeft}
          />

          {voted && (
            <p className="text-center text-[25px] font-bold text-gray-700 mt-6">
              Wait for the teacher to ask a new question..
            </p>
          )}
        </div>
      )}

      <ChatPopup socket={socket} />
    </div>
  );
}
