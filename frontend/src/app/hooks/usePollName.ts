// usePollName.ts
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "@/app/constants";

type PollDataType = [string, BigInt, boolean];

export function usePollName(pollId: number) {
  const { data: pollData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getPoll",
    args: [pollId],
  });

  const pollName = pollData ? (pollData as PollDataType)[0] : null;
  const hasEnded = pollData ? !(pollData as PollDataType)[2] : null;

  return { pollName, hasEnded };
}
