export default function PollCard({ poll, onVote, voted }) {
  const totalVotes = poll.results.reduce((a, b) => a + b.votes, 0);

  return (
    <div className="w-[700px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="bg-gray-700 text-white px-5 py-3 text-sm font-medium">
        {poll.question}
      </div>

      <div className="p-6 space-y-4">

        {poll.options.map((opt, i) => {
          const votes = poll.results[i]?.votes || 0;
          const percentage =
            totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

          return (
            <div
              key={i}
              onClick={() => !voted && onVote?.(i)}
              className="relative h-12 bg-[#E7E8F2] rounded-md overflow-hidden cursor-pointer"
            >
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#7C6CF4] to-[#5B4DE3] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />

              <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center text-[#6D5DF6] font-semibold">
                    {i + 1}
                  </div>
                  {opt}
                </div>

                <span>{percentage}%</span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}