// lib/web3modal.ts
import { createWeb3Modal } from "@web3modal/react";
import { config } from "./wagmi"

// ✅ Initialize Web3Modal once, client-side only
if (typeof window !== "undefined") {
  createWeb3Modal({
    wagmiConfig: config,
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    enableAnalytics: true, // optional
  })
}
