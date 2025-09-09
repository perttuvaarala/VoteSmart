"use client";
import History from "@/app/components/History";
import HomeButton from "@/app/components/HomeButton";
import { usePollName } from "@/app/hooks/usePollName";
import { useParams } from "next/navigation";

export default function PollHistoryPage() {
  const { pollId } = useParams();
  const pollIdNumber = Number(pollId);
  const { pollName } = usePollName(pollIdNumber);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-300 p-4">
      <h1 className="text-5xl font-bold text-black mb-6">{pollName}</h1>
      <div className="w-full max-w-3xs">
        <History pollId={pollIdNumber} />
        <HomeButton />
      </div>
    </div>
  );
}
