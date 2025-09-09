"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function useWallet() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    connect({ connector: injected() });
  };

  return {
    isConnected,
    address,
    connectWallet,
    disconnect,
  };
}
