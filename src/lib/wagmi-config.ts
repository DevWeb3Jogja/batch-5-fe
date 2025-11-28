import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Fe Bootcamp Web3 Jogja App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [
    {
      ...baseSepolia,
    },
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: false,
});
