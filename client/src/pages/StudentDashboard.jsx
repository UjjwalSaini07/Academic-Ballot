import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSocket } from "../hooks/useSocket";
import { usePollTimer } from "../hooks/usePollTimer";
import PollCard from "../components/PollCard";
import ChatPopup from "../components/ChatPopup";

export default function StudentDashboard() {
  const socket = useSocket();
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

  // Call usePollTimer at the top level to follow Rules of Hooks
  const timeLeft = usePollTimer(poll?.startTime || 0, poll?.duration || 0);

  // Initial fetch and periodic polling as fallback
  useEffect(() => {
    fetchPoll();
    const interval = setInterval(fetchPoll, 3000); // Poll every 3 seconds as fallback
    return () => clearInterval(interval);
  }, [fetchPoll]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", name);

    // Handle new poll created
    const handlePollCreated = (newPoll) => {
      setPoll(newPoll);
      setVoted(false); // Reset voted state for new poll
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
    };

    // Handle errors
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

    // Cleanup listeners
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
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4">
        <div className="mb-6">
          <span className="px-4 py-1 text-xs font-medium rounded-full text-white 
          bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]">
            Intervue Poll
          </span>
        </div>

        <h2 className="text-[28px] font-semibold text-center">
          You’ve been Kicked out !
        </h2>

        <p className="text-gray-500 text-sm text-center mt-3 max-w-[420px] leading-relaxed">
          Looks like the teacher had removed you from the poll system.
          Please Try again sometime.
        </p>
      </div>
    );
  }

    if (!poll) {
      return (
        <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4">
          <div className="mb-6">
            <span className="px-4 py-1 text-xs font-medium rounded-full text-white 
            bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]">
              Intervue Poll
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
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center relative">
      {poll && (
        <div className="flex flex-col items-center gap-6">
          <PollCard poll={poll} onVote={vote} voted={voted} timeLeft={timeLeft} />
        </div>
      )}
      <ChatPopup socket={socket} />
    </div>
  );
}
