import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism } from "wagmi/chains";
import { brand } from "@/lib/brand";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const config = getDefaultConfig({
  appName: brand.name,
  projectId: projectId || "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [mainnet, optimism, arbitrum, base],
  ssr: true,
});
