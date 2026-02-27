import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoleSelection() {

  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-12 rounded-2xl w-[650px] text-center shadow-sm">

        <div className="mb-6 text-primary font-semibold text-sm">
          Intervue Poll
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Welcome to the <span className="text-black">Live Polling System</span>
        </h1>

        <p className="text-gray-500 mb-10">
          Please select the role that best describes you
        </p>

        <div className="flex gap-6 justify-center mb-8">

          <div
            onClick={() => setRole("student")}
            className={`border p-6 rounded-xl w-60 cursor-pointer transition
              ${role === "student"
                ? "border-primary bg-indigo-50"
                : "border-gray-200"}`}
          >
            <h3 className="font-semibold text-lg">I’m a Student</h3>
            <p className="text-sm text-gray-500 mt-2">
              Submit answers and view results in real-time.
            </p>
          </div>

          <div
            onClick={() => setRole("teacher")}
            className={`border p-6 rounded-xl w-60 cursor-pointer transition
              ${role === "teacher"
                ? "border-primary bg-indigo-50"
                : "border-gray-200"}`}
          >
            <h3 className="font-semibold text-lg">I’m a Teacher</h3>
            <p className="text-sm text-gray-500 mt-2">
              Create polls and monitor live responses.
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate(`/${role}`)}
          className="bg-primary hover:bg-primaryDark text-white px-12 py-3 rounded-full transition"
        >
          Continue
        </button>

      </div>

    </div>
  );
}