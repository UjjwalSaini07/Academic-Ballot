import { useEffect, useState } from "react";
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

  useEffect(() => {
    axios.get("http://localhost:5000/api/poll/active")
      .then(res => setPoll(res.data));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", name);

    socket.on("poll_created", setPoll);
    socket.on("vote_update", setPoll);
    socket.on("kicked", () => setKicked(true));

  }, [socket]);

  if (kicked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">You’ve been kicked out!</h2>
          <p className="text-gray-500 mt-2">Try again later.</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Wait for the teacher to ask questions...
        </h2>
      </div>
    );
  }

  const timeLeft = usePollTimer(poll.startTime, poll.duration);

  const vote = (index) => {
    socket.emit("vote", {
      pollId: poll._id,
      studentName: name,
      optionIndex: index
    });
    setVoted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      <div className="text-center">
        <div className="flex justify-center mb-4 gap-2">
          <h2 className="font-bold">Question 1</h2>
          <span className="text-red-500 font-semibold">
            00:{timeLeft}
          </span>
        </div>

        <PollCard poll={poll} onVote={vote} voted={voted} />

        {timeLeft === 0 && (
          <div className="mt-6 text-gray-600">
            Wait for the teacher to ask a new question..
          </div>
        )}
      </div>

      <ChatPopup socket={socket} />

    </div>
  );
}