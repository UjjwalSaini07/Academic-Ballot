import { useState, useEffect } from "react";
import api from "../api";

export default function AdminPanel({ onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushResult, setFlushResult] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      console.log("Fetching analytics from:", `${api.defaults.baseURL}/api/poll/analytics`);
      const res = await api.get("/api/poll/analytics");
      console.log("Analytics data:", res.data);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      console.error("Error response:", err.response?.data);
      setAnalyticsError(err.response?.data?.error || err.message || "Failed to load analytics");
    }
    setAnalyticsLoading(false);
  };

  const handleFlushDatabase = async () => {
    if (!window.confirm("Are you sure you want to delete ALL database records? This cannot be undone!")) {
      return;
    }
    
    setIsFlushing(true);
    setFlushResult(null);
    
    try {
      const res = await api.post("/api/poll/admin/flush", { passkey: "ujjwal07" });
      setFlushResult(res.data);
      fetchAnalytics();
    } catch (err) {
      setFlushResult({ error: err.response?.data?.error || "Failed to flush database" });
    }
    
    setIsFlushing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {analyticsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#6D5DF6] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : analyticsError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2">{analyticsError}</p>
                <button 
                  onClick={fetchAnalytics}
                  className="px-4 py-2 bg-[#6D5DF6] text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#6D5DF6] to-[#8B7FE8] rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">Total Polls</p>
                  <p className="text-3xl font-bold">{analytics?.totalPolls || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">Total Votes</p>
                  <p className="text-3xl font-bold">{analytics?.totalVotes || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">Participants</p>
                  <p className="text-3xl font-bold">{analytics?.totalParticipants || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-[#EF4444] to-[#F87171] rounded-xl p-4 text-white">
                  <p className="text-sm opacity-80">Kicked</p>
                  <p className="text-3xl font-bold">{analytics?.kickedParticipants || 0}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-4">Polls (Last 7 Days)</h3>
                  <div className="h-48 flex items-end gap-2">
                    {analytics?.pollsByDay?.length > 0 ? (
                      analytics.pollsByDay.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-[#6D5DF6] rounded-t transition-all duration-300"
                            style={{ height: `${Math.max((day.count / Math.max(...analytics.pollsByDay.map(d => d.count), 1)) * 100, 10)}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{day._id?.slice(5) || '-'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center text-gray-400">No data</div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-4">Votes (Last 7 Days)</h3>
                  <div className="h-48 flex items-end gap-2">
                    {analytics?.votesByDay?.length > 0 ? (
                      analytics.votesByDay.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-[#10B981] rounded-t transition-all duration-300"
                            style={{ height: `${Math.max((day.count / Math.max(...analytics.votesByDay.map(d => d.count), 1)) * 100, 10)}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{day._id?.slice(5) || '-'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center text-gray-400">No data</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Polls */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Recent Polls</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analytics?.recentPolls?.length > 0 ? (
                    analytics.recentPolls.map((poll, i) => {
                      const totalVotes = poll.results?.reduce((a, b) => a + (b.votes || 0), 0) || 0;
                      return (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <span className="text-sm font-medium truncate flex-1">{poll.question}</span>
                          <span className="text-sm text-gray-500 ml-4">{totalVotes} votes</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">No polls yet</p>
                  )}
                </div>
              </div>

              {/* Flush Database */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="font-semibold mb-2 text-red-700">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">Delete all polls, votes, and participants from the database.</p>
                <button
                  onClick={handleFlushDatabase}
                  disabled={isFlushing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isFlushing ? "Flushing..." : "Flush Database"}
                </button>
                {flushResult && (
                  <div className={`mt-4 p-3 rounded-lg ${flushResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {flushResult.success ? (
                      <p>Deleted: {flushResult.deleted?.polls} polls, {flushResult.deleted?.votes} votes, {flushResult.deleted?.participants} participants</p>
                    ) : (
                      <p>{flushResult.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
