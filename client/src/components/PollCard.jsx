export default function PollCard({ poll, onVote, voted }) {

  const totalVotes = poll.results.reduce((a, b) => a + b.votes, 0);

  return (
    <div className="bg-white p-6 rounded-xl w-[600px] shadow-sm">

      <div className="bg-gray-800 text-white p-3 rounded-t-lg mb-4">
        {poll.question}
      </div>

      {poll.options.map((opt, i) => {

        const votes = poll.results[i]?.votes || 0;
        const percentage = totalVotes === 0
          ? 0
          : Math.round((votes / totalVotes) * 100);

        return (
          <div
            key={i}
            onClick={() => !voted && onVote(i)}
            className="mb-3 border rounded-lg overflow-hidden cursor-pointer"
          >
            <div
              className="bg-primary text-white p-3 transition-all"
              style={{ width: `${percentage}%` }}
            >
              {opt}
            </div>
            <div className="absolute right-4 -mt-8 text-sm font-semibold">
              {percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
}