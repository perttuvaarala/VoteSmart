import { useWallet } from "../hooks/useWallet";

export default function ConnectWallet() {
  const { isConnected, connectWallet } = useWallet();

  return (
    <button
      onClick={connectWallet}
      className=" w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
}
