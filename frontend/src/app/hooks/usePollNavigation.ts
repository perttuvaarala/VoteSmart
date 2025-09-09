"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";

export function usePollNavigation(hash: string | undefined) {
  const router = useRouter();

  const validHash = hash?.startsWith("0x") ? (hash as `0x${string}`) : undefined;

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: validHash,
  });

  const { data: latestId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getLatestPollId",
  });

  const pollId = latestId ? Number(latestId) + 1 : null;

  useEffect(() => {
    if (isConfirmed && pollId !== null) {
      router.push(`/poll/${pollId}`);
    }
  }, [isConfirmed, router, pollId]);

  return { pollId };
}
