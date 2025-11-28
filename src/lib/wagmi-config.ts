import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";

export const USDC_MOCK_ADDRESS =
  "0xF6f2377B59c2c316537a64F5c366DE38f3FB0796" as const;

export const VAULT_ADDRESS = '0x613148C5e1A27c99B28Cb01A5954C5dD3b2c9abf' as const;

export const DEFAULT_MINT_AMOUNT = formatUnits(100n, 6);

export const config = getDefaultConfig({
  appName: "Fe Bootcamp Web3 Jogja App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [{
    ...baseSepolia
  }],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: false,
});
