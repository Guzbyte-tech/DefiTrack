import { createConfig, http } from "wagmi"
import { mainnet, sepolia, optimismSepolia, baseSepolia } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, sepolia, optimismSepolia, baseSepolia],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})
