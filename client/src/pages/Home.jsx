import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Live Polling System</h1>
      <button onClick={() => nav("/student")}>I'm a Student</button>
      <button onClick={() => nav("/teacher")}>I'm a Teacher</button>
    </div>
  );
}
