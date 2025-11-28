import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/shared/navbar";
import { FaucetPage } from "./pages/faucet";
import { EarnPage } from "./pages/earn";
import { config } from "./lib/wagmi-config";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

const queryClient = new QueryClient();

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ["google", "wallet"],
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          walletList: ["detected_ethereum_wallets"],
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Navigate to="/faucet" replace />} />
                <Route path="/earn" element={<EarnPage />} />
                <Route path="/faucet" element={<FaucetPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}

export default App;
