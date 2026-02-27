import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export default function Teacher() {
  const socket = useSocket();
  const [poll, setPoll] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getActivePoll");
    socket.on("activePoll", setPoll);
  }, [socket]);

  const createPoll = () => {
    socket.emit("createPoll", {
      question,
      options: options.map(o => ({ text: o })),
      duration: 60
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Teacher Dashboard</h2>
      {!poll && (
        <div>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Question" />
          {options.map((opt, i) => (
            <input key={i} value={opt} onChange={e => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }} placeholder={"Option " + (i+1)} />
          ))}
          <button onClick={createPoll}>Create Poll</button>
        </div>
      )}
      {poll && (
        <div>
          <h3>{poll.question}</h3>
          {poll.options.map((opt, i) => (
            <p key={i}>{opt.text} - {opt.votes} votes</p>
          ))}
        </div>
      )}
    </div>
  );
}
