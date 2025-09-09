"use client";
import CreatePoll from "./components/CreatePoll";
import JoinPoll from "./components/JoinPoll";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-300 p-4">
      <h1 className="text-5xl font-bold text-black mb-6">VoteSmart</h1>

      <div className="w-full max-w-3xs">
        <JoinPoll />
      </div>

      <div className="my-2 text-gray-900 font-semibold">Or</div>

      <div className="w-full max-w-3xs">
        <CreatePoll />
      </div>
    </div>
  );
};

export default HomePage;
