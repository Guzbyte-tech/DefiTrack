// lib/wagmi.ts
import { createConfig, http } from "wagmi"
import { mainnet, sepolia, optimismSepolia, baseSepolia } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo"

export const config = createConfig({
  chains: [mainnet, sepolia, optimismSepolia, baseSepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})
