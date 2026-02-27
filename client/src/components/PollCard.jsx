export default function PollCard({ poll, onVote, voted, timeLeft }) {
  const totalVotes = poll.results.reduce((a, b) => a + b.votes, 0);
  
  // Show answer only when teacher explicitly reveals it
  const showAnswer = poll.showAnswer === true;

  // Show results after voting OR when answer is revealed
  const showResults = voted || showAnswer;

  return (
    <div className="w-[700px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="bg-gray-700 text-white px-5 py-3 text-sm font-medium flex justify-between items-center">
        <span>{poll.question}</span>
        {timeLeft !== undefined && (
          <span className="text-xs bg-red-500 px-2 py-1 rounded">
            {timeLeft}s left
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">

        {poll.options.map((opt, i) => {
          const votes = poll.results[i]?.votes || 0;
          const percentage =
            totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
          
          // Determine if this option is correct or wrong (only when answer is revealed)
          const isCorrect = showAnswer && poll.correctOption === i;
          const isWrong = showAnswer && poll.correctOption !== i;

          return (
            <div
              key={i}
              onClick={() => !voted && onVote?.(i)}
              className={`relative h-12 rounded-md overflow-hidden cursor-pointer ${
                !showResults 
                  ? "border-2 border-[#6D5DF6] bg-[#F0EEFE]" :
                isCorrect ? "border-2 border-green-500 bg-green-50" : 
                isWrong ? "border-2 border-red-300 bg-red-50" : 
                "border border-gray-200"
              }`}
            >
              {showResults && (
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                    isCorrect ? "bg-green-500" : 
                    isWrong ? "bg-red-300" :
                    "bg-gradient-to-r from-[#7C6CF4] to-[#5B4DE3]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    !showResults 
                      ? "bg-[#6D5DF6] text-white" :
                    isCorrect ? "bg-green-500 text-white" : 
                    isWrong ? "bg-red-300 text-white" :
                    "bg-white text-[#6D5DF6]"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={isCorrect ? "text-green-700" : isWrong ? "text-red-700" : ""}>{opt}</span>
                </div>

                {showResults ? (
                  <div className={`px-3 py-[2px] rounded-[6px] text-[12px] font-semibold ${
                    isCorrect ? "bg-green-500 text-white" : 
                    isWrong ? "bg-red-300 text-white" :
                    "bg-white border border-[#6D5DF6] text-[#6D5DF6]"
                  }`}>
                    {percentage}%
                  </div>
                ) : (
                  <div className="text-xs text-[#6D5DF6] font-medium">
                    Tap to vote
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}