import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export default function Student() {
  const socket = useSocket();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getActivePoll");
    socket.on("activePoll", setPoll);
  }, [socket]);

  const vote = (index) => {
    socket.emit("vote", { pollId: poll._id, optionIndex: index });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Student</h2>
      {poll ? (
        <div>
          <h3>{poll.question}</h3>
          {poll.options.map((opt, i) => (
            <button key={i} onClick={() => vote(i)}>{opt.text}</button>
          ))}
        </div>
      ) : <p>Waiting for poll...</p>}
    </div>
  );
}
