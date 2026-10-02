"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletButton() {
  return (
    <span className="wallet-connect">
      <ConnectButton label="Connect Wallet" showBalance={false} />
    </span>
  );
}
