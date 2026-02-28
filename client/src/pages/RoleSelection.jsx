import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";

export default function RoleSelection() {
  const [role, setRole] = useState("student");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const navigate = useNavigate();

  const handleAdminClick = () => {
    setShowPasswordPrompt(true);
    setAdminError("");
    setPassword("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "ujjwal07") {
      setShowPasswordPrompt(false);
      setShowAdmin(true);
    } else {
      setAdminError("Invalid passkey");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center relative">
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Admin Access</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passkey"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#6D5DF6]"
                autoFocus
              />
              {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#6D5DF6] text-white rounded-lg hover:bg-[#5B4CE6]"
                >
                  Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="inline-block px-4 py-1 text-xs font-medium bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full mb-6">
          ✦ Intervue Poll
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
            <h3 className="text-lg font-semibold mb-2">I'm a Student</h3>
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
            <h3 className="text-lg font-semibold mb-2">I'm a Teacher</h3>
            <p className="text-sm text-gray-500">
              Create polls and monitor live responses.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/${role}`)}
          className="px-16 py-3 text-white text-sm font-medium rounded-full
          bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] shadow-md hover:opacity-95"
        >
          Continue
        </button>
      </div>

      <button
        onClick={handleAdminClick}
        className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        Admin
      </button>

      <a 
        href="https://www.ujjwalsaini.dev/" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Developer Info"
        className="absolute bottom-6 right-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6D5DF6] text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
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
