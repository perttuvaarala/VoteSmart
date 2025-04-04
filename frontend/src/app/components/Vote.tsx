import { useEffect } from "react";
import { usePollData } from "@/app/hooks/usePollData";
import { useVote } from "@/app/hooks/useVote";
import Duration from "@/app/components/Duration";

type VoteProps = {
  pollId: number;
};

export default function Vote({ pollId }: VoteProps) {
  const { options, endTime, hasEnded, isLoading, refetch } =
    usePollData(pollId);
  const { selectedOption, setSelectedOption, hasVoted, handleVote } =
    useVote(pollId);

  useEffect(() => {
    if (!endTime || hasEnded) return;

    const interval = setInterval(() => {
      if (BigInt(Date.now()) / BigInt(1000) >= BigInt(endTime)) {
        refetch();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, hasEnded, refetch]);

  return (
    <div
      className={`max-w-md mx-auto bg-amber-100 shadow-lg rounded-lg p-4 mb-2 ${
        hasEnded ? "bg-gray-300" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-center text-gray-800">Poll</h1>
      <h2 className="text-1xl text-center text-gray-800 mb-4">ID: {pollId}</h2>

      {isLoading ? (
        <div className="text-center text-lg font-semibold text-gray-500 mt-4">
          Loading...
        </div>
      ) : (
        <ul className="mt-4">
          {options.map((option) => {
            const maxVotes = Math.max(
              ...options.map((opt) => Number(opt.voteCount.toString()))
            );
            const isMostVoted =
              option.voteCount.toString() === maxVotes.toString();

            const optionColor = hasEnded
              ? isMostVoted
                ? "bg-green-300"
                : "bg-gray-200"
              : selectedOption === option.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100";

            return (
              <li
                key={option.id}
                className={`p-2 border rounded cursor-pointer mt-2 ${optionColor} ${
                  hasEnded ? "pointer-events-none opacity-60" : ""
                }`}
                onClick={() => {
                  if (!hasEnded && !hasVoted) {
                    setSelectedOption(option.id);
                  }
                }}
              >
                {option.name} {hasEnded ? `votes: ${option.voteCount}` : ""}
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={handleVote}
        className="w-full mt-4 bg-green-500 text-white p-2 rounded disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed hover:bg-green-600"
        disabled={selectedOption === null || hasEnded || hasVoted}
      >
        Vote
      </button>

      {endTime !== null && <Duration endTime={endTime} />}
    </div>
  );
}
