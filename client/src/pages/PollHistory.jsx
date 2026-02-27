import { useEffect, useState } from "react";
import axios from "axios";

export default function PollHistory() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/poll/history")
      .then((res) => setPolls(res.data))
      .catch(() => setPolls([]));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-6 py-16">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-[32px] font-semibold mb-10">
          View <span className="font-bold">Poll History</span>
        </h1>

        {polls.map((poll, index) => (
          <div key={poll._id} className="mb-14">
            <h2 className="text-[18px] font-semibold mb-4">
              Question {index + 1}
            </h2>

            <div className="rounded-[12px] border border-[#CFCFE3] bg-white overflow-hidden">
              <div className="bg-[#4A4A4A] text-white px-5 py-3 text-[14px] font-medium">
                {poll.question}
              </div>

              <div className="p-5 space-y-3">
                {poll.options.map((opt, i) => {
                  const totalVotes = poll.results.reduce(
                    (sum, r) => sum + r.votes,
                    0,
                  );

                  const votes = poll.results[i]?.votes || 0;

                  const percent =
                    totalVotes === 0
                      ? 0
                      : Math.round((votes / totalVotes) * 100);

                  const isCorrect =
                    poll.correctOption !== undefined &&
                    poll.correctOption === i;

                  const isWrong =
                    poll.correctOption !== undefined &&
                    poll.correctOption !== i;

                  return (
                    <div
                      key={i}
                      className={`relative h-[44px] rounded-[8px] border overflow-hidden
                      ${
                        isCorrect
                          ? "border-green-400 bg-green-50"
                          : isWrong
                            ? "border-red-200 bg-red-50"
                            : "border-[#E3E3EC] bg-[#F8F8FC]"
                      }`}
                    >
                      {/* Progress Bar */}
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-500
                        ${
                          isCorrect
                            ? "bg-green-500"
                            : isWrong
                              ? "bg-red-300"
                              : "bg-gradient-to-r from-[#6D5DF6] to-[#8E7CFF]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />

                      <div className="relative flex items-center justify-between h-full px-4 text-[14px]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium
                            ${
                              isCorrect
                                ? "bg-green-500 text-white"
                                : isWrong
                                  ? "bg-red-300 text-white"
                                  : "bg-[#6D5DF6] text-white"
                            }`}
                          >
                            {i + 1}
                          </div>

                          <span
                            className={`font-medium
                            ${
                              isCorrect
                                ? "text-green-700"
                                : isWrong
                                  ? "text-red-700"
                                  : ""
                            }`}
                          >
                            {opt}
                          </span>
                        </div>

                        <div
                          className={`px-3 py-[2px] rounded-[6px] text-[12px] font-semibold
                          ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : isWrong
                                ? "bg-red-300 text-white"
                                : "bg-white border border-[#6D5DF6] text-[#6D5DF6]"
                          }`}
                        >
                          {percent}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
