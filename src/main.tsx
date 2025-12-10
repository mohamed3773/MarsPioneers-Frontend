import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, optimism, avalanche, base } from "wagmi/chains";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Fix: Import UserProvider to prevent "useUser must be used within a UserProvider" crash
import { UserProvider } from "./components/UserContext";
// Fix: Import ErrorBoundary to catch rendering errors and prevent blank screen
import ErrorBoundary from "./components/ErrorBoundary";

const projectId = "11e2499529015a603f7aed6df73fb7ae";

const { connectors } = getDefaultWallets({
  appName: "Mars Pioneers 2040",
  projectId,
});

// Customize Polygon chain to use POL (updated September 2024)
const polygonWithPOL = {
  ...polygon,
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
};

// Multi-Chain Configuration: Support for 7 networks
const config = createConfig({
  chains: [mainnet, polygonWithPOL, bsc, arbitrum, optimism, avalanche, base],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Fix: ErrorBoundary catches any rendering errors to prevent blank screen */}
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {/* Fix: Wrap App with UserProvider so all components can access user context */}
            <UserProvider>
              <App />
            </UserProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
