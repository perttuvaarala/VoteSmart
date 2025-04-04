"use client";
import { useCreatePoll } from "@/app/hooks/useCreatePoll";
import { usePollNavigation } from "@/app/hooks/usePollNavigation";
import ConnectWallet from "./ConnectWallet";

export default function CreatePoll() {
  const {
    name,
    setName,
    duration,
    setDuration,
    options,
    newOption,
    setNewOption,
    addOption,
    handleCreatePoll,
    hash,
    isConnected,
  } = useCreatePoll();

  usePollNavigation(hash);

  return (
    <div className="max-w-md mx-auto bg-amber-100 shadow-lg rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create Poll
      </h2>
      <input
        type="text"
        placeholder="Poll Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mt-4 border rounded bg-white"
      />
      <input
        type="text"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-2 mt-4 border rounded bg-white"
      />
      <div className="mt-4">
        <input
          type="text"
          placeholder="Add Option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        />
        <button
          onClick={addOption}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Add Option
        </button>
      </div>
      <ul className="mt-2">
        {options.map((opt, idx) => (
          <li key={idx} className="text-gray-700 text-center">
            {opt}
          </li>
        ))}
      </ul>
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <button
          onClick={handleCreatePoll}
          className="w-full bg-green-500 text-white mt-2 p-2 rounded cursor-pointer hover:bg-green-600"
          disabled={!isConnected || !name || !duration || options.length === 0}
        >
          Create
        </button>
      )}
    </div>
  );
}
