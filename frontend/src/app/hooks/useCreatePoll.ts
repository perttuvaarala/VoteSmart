"use client";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../constants";
import { useAccount } from "wagmi";

export function useCreatePoll() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const { writeContract, data: hash } = useWriteContract();
  const { address, isConnected } = useAccount();

  const handleCreatePoll = async () => {
    if (!isConnected || !name || !duration || options.length === 0) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "createPoll",
      args: [name, Number(duration), options],
    });
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  return {
    name,
    setName,
    duration,
    setDuration,
    options,
    newOption,
    setNewOption,
    addOption,
    handleCreatePoll,
    isConnected,
    hash,
  };
}
