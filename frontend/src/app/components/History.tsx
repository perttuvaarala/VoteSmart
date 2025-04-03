import { useEffect, useState } from "react";
import { publicClient } from "@/app/client";
import { parseAbiItem } from "viem";
import { CONTRACT_ADDRESS } from "@/app/constants";

type VoteHistoryLog = {
  pollId?: bigint;
  optionId?: bigint;
  optionName?: string;
  voteCount?: bigint;
  voter?: string;
  timestamp?: bigint;
};

export default function History({ pollId }: { pollId: number }) {
  const [voteHistory, setVoteHistory] = useState<VoteHistoryLog[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event VoteCast(uint256 indexed pollId, uint256 indexed optionId, uint256 voteCount, string optionName, address indexed voter, uint256 timestamp)"
        ),
        fromBlock: BigInt(19881870),
        toBlock: "latest",
        args: { pollId: BigInt(pollId) },
      });

      const historyItems = logs.map((log: { args: VoteHistoryLog }) => ({
        pollId: log.args.pollId,
        optionId: log.args.optionId,
        optionName: log.args.optionName,
        voteCount: log.args.voteCount,
        voter: log.args.voter,
        timestamp: log.args.timestamp,
      }));

      setVoteHistory(historyItems);
    };

    fetchHistory();
  }, [pollId]);

  const trimAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Vote history
      </h1>
      <h2 className="text-1xl text-center text-gray-800">Poll ID: {pollId}</h2>
      {voteHistory.length === 0 ? (
        <div className="text-center text-gray-500 mt-2">No votes cast yet.</div>
      ) : (
        <ul className="mt-4 space-y-2">
          {voteHistory.map((item, index) => (
            <li key={index}>
              <div className="flex justify-between flex-wrap rounded-lg p-1 bg-gray-200 shadow-md">
                <div className="flex flex-col space-y-1">
                  <p>
                    <strong>Option:</strong> {item.optionName}
                  </p>
                  <p>
                    <strong>Votes:</strong> {item.voteCount}
                  </p>
                  <p>
                    <strong>Voter:</strong> {trimAddress(item.voter || "")}
                  </p>
                  <p>
                    <strong>Timestamp: </strong>
                    <br />
                    {new Date(Number(item.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
