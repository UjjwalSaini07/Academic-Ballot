import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 100, position: "relative" }}>
      <h1>Live Polling System</h1>
      <button onClick={() => nav("/student")}>I'm a Student</button>
      <button onClick={() => nav("/teacher")}>I'm a Teacher</button>
      
      {/* Developer Info Icon - redirects to portfolio */}
      <a 
        href="https://www.ujjwalsaini.dev/" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Developer Info"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#6D5DF6",
          color: "white",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </a>
    </div>
  );
}
