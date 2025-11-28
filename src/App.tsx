import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/shared/navbar";
import { FaucetPage } from "./pages/faucet";
import { EarnPage } from "./pages/earn";
import { config } from "./lib/wagmi-config";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
