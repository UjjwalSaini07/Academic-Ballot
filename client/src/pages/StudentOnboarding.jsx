import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function StudentOnboarding() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      // Register student via HTTP API (works without sockets)
      await api.post("/api/poll/register", { name });
      sessionStorage.setItem("studentName", name);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      if (err.response?.data?.error === "You have been kicked out") {
        alert("You have been kicked out by the teacher. Please contact your teacher.");
      } else {
        // Still allow joining even if registration fails (for local dev)
        sessionStorage.setItem("studentName", name);
        navigate("/student/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <span className="px-4 py-1 text-xs font-medium rounded-full text-white bg-gradient-to-r from-[#7565D9] to-[#4D0ACD]">
          ✦ Intervue Poll
        </span>
      </div>

      <h1 className="text-[28px] font-semibold text-center">
        Let’s Get Started
      </h1>

      <p className="text-gray-500 text-center text-sm mt-3 max-w-[520px] leading-relaxed">
        If you’re a student, you’ll be able to{" "}
        <span className="font-medium text-black">submit your answers</span>,
        participate in live polls, and see how your responses compare with your
        classmates
      </p>

      <div className="w-full max-w-[420px] mt-10">
        <label className="block text-sm font-medium mb-2">
          Enter your Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full h-[44px] px-4 rounded-lg border border-[#D9D9E8] bg-[#ECECEC] 
          text-sm focus:outline-none focus:border-[#6D5DF6]"
        />
      </div>

      <button
        onClick={handleContinue}
        className="mt-10 px-12 py-3 rounded-full text-white text-sm font-medium
        bg-gradient-to-r from-[#8F64E1] to-[#1D68BD]
        shadow-md hover:opacity-95 transition"
      >
        Continue
      </button>
    </div>
  );
}
