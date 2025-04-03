import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPoll() {
  const [pollId, setPollId] = useState("");
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();

  const handleJoinVote = () => {
    !pollId || isNaN(Number(pollId)) || Number(pollId) <= 0
      ? setIsValid(false)
      : (setIsValid(true), router.push(`/poll/${pollId}`));
  };

  return (
    <div className="max-w-md mx-auto bg-amber-100 shadow-lg rounded-lg p-6 mt-8 m-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Join Poll
      </h2>
      <div>
        <input
          type="text"
          placeholder="Enter Poll ID"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
          onBlur={() =>
            setIsValid(!!pollId && !isNaN(Number(pollId)) && Number(pollId) > 0)
          }
          className="w-full p-2 mt-4 border rounded bg-white"
        />
        {!isValid && (
          <p className="text-red-500 text-sm mt-2">
            Please enter a valid Poll ID.
          </p>
        )}
      </div>

      <div className="mt-2">
        <button
          onClick={handleJoinVote}
          className="w-full text-center bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 cursor-pointer"
        >
          Join
        </button>
      </div>
    </div>
  );
}
