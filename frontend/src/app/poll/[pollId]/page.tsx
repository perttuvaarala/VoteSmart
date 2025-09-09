"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePollName } from "@/app/hooks/usePollName";
import Vote from "@/app/components/Vote";
import HomeButton from "@/app/components/HomeButton";

export default function PollPage() {
  const { pollId } = useParams();
  const pollIdNumber = Number(pollId);
  const { pollName, hasEnded } = usePollName(pollIdNumber);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-300 p-4">
      {pollName ? (
        <>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">{pollName}</h1>
          <div className="w-full max-w-3xs">
            <Vote pollId={pollIdNumber} />
          </div>
          {hasEnded && (
            <Link
              href={`/poll/${pollId}/history`}
              className="w-full text-center text-red-500 cursor-pointer underline text-xl mt-2"
            >
              Inspect history
            </Link>
          )}
        </>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Poll doesn't exist
          </h1>
          <HomeButton />
        </div>
      )}
    </div>
  );
}
