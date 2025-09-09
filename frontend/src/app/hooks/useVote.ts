import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "@/app/constants";

export function useVote(pollId: number) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const { writeContract } = useWriteContract();

  const handleVote = async () => {
    if (selectedOption === null || hasVoted) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "vote",
      args: [pollId, selectedOption],
    });

    //setHasVoted(true);
   // setSelectedOption(null);
  };

  return { selectedOption, setSelectedOption, hasVoted, handleVote };
}
