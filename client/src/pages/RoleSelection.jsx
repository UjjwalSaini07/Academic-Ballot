import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
      <div className="text-center">

        <div className="inline-block px-4 py-1 text-xs font-medium bg-[#6D5DF6] text-white rounded-full mb-6">
          Intervue Poll
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-2">
          Welcome to the <span className="font-bold">Live Polling System</span>
        </h1>

        <p className="text-gray-500 text-sm mb-10">
          Please select the role that best describes you
        </p>

        <div className="flex gap-6 justify-center mb-10">

          <div
            onClick={() => setRole("student")}
            className={`w-[280px] p-6 rounded-xl border cursor-pointer transition
              ${
                role === "student"
                  ? "border-2 border-[#6D5DF6] bg-[#F4F2FF]"
                  : "border border-gray-200 bg-white"
              }`}
          >
            <h3 className="text-lg font-semibold mb-2">I’m a Student</h3>
            <p className="text-sm text-gray-500">
              Submit answers and view results in real-time.
            </p>
          </div>

          <div
            onClick={() => setRole("teacher")}
            className={`w-[280px] p-6 rounded-xl border cursor-pointer transition
              ${
                role === "teacher"
                  ? "border-2 border-[#6D5DF6] bg-[#F4F2FF]"
                  : "border border-gray-200 bg-white"
              }`}
          >
            <h3 className="text-lg font-semibold mb-2">I’m a Teacher</h3>
            <p className="text-sm text-gray-500">
              Create polls and monitor live responses.
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate(`/${role}`)}
          className="px-16 py-3 text-white text-sm font-medium rounded-full
          bg-gradient-to-r from-[#7C6CF4] to-[#5B4DE3] shadow-md hover:opacity-95"
        >
          Continue
        </button>

      </div>
    </div>
  );
}