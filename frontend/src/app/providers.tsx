"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http(),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
