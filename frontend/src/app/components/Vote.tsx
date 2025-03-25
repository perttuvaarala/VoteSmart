"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcProvider, Contract } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL!;

const ABI = [
  "function candidates(uint256) view returns (string memory, uint256)",
  "function candidatesCount() view returns (uint256)",
  "function vote(uint256 candidateId) public",
];

export default function Vote() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setCurrentAccount(await signer.getAddress());
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchCandidates = async () => {
    const provider = new JsonRpcProvider(POLYGON_RPC_URL);
    const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
    const count = await contract.candidatesCount();

    let candidatesList = [];
    for (let i = 0; i < count; i++) {
      const [name, voteCount] = await contract.candidates(i);
      candidatesList.push({ id: i, name, voteCount });
    }
    setCandidates(candidatesList);
  };

  const vote = async (candidateId: number) => {
    if (!currentAccount) {
      alert("Please connect your wallet.");
      return;
    }

    setLoading(true);
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      alert("Vote successfully cast!");
      fetchCandidates(); // Refresh UI
    } catch (error) {
      console.error("Vote failed", error);
      alert("You have already voted");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      fetchCandidates();
    }
  }, []);

  return (
    <div>
      {!currentAccount && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {currentAccount && <p>Connected as: {currentAccount}</p>}

      <h2>Candidates:</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - Votes: {candidate.voteCount}
            <button onClick={() => vote(candidate.id)} disabled={loading}>
              Vote
            </button>
          </li>
        ))}
      </ul>

      {loading && <p>Loading...</p>}
    </div>
  );
}
