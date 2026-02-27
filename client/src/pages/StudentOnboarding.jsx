import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentOnboarding() {

  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    sessionStorage.setItem("studentName", name);
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-12 rounded-2xl w-[600px] text-center shadow-sm">

        <h2 className="text-3xl font-bold mb-4">
          Let’s Get Started
        </h2>

        <p className="text-gray-500 mb-8">
          Enter your name to join the poll
        </p>

        <input
          className="w-full border rounded-lg p-3 mb-8"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleContinue}
          className="bg-primary text-white px-10 py-3 rounded-full"
        >
          Continue
        </button>

      </div>

    </div>
  );
}