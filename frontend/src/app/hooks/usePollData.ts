import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "@/app/constants";

type Option = {
  id: number;
  name: string;
  voteCount: number;
};

type PollDataType = [string, BigInt, boolean, Option[]];

export function usePollData(pollId: number) {
  const [options, setOptions] = useState<Option[]>([]);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  const {
    data: pollData,
    isLoading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getPoll",
    args: [pollId],
  });

  useEffect(() => {
    if (pollData) {
      const [name, pollEndTime, isActive, fetchedOptions] =
        pollData as PollDataType;
      setOptions(fetchedOptions);
      setEndTime(Number(pollEndTime.toString()));
      setHasEnded(!isActive);
    }
  }, [pollData]);

  return { options, endTime, hasEnded, isLoading, refetch };
}
