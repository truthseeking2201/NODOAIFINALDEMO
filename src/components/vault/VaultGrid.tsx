
import React, { memo } from "react";
import { VaultCard } from "./VaultCard";
import { VaultData } from "@/types/vault";

interface VaultGridProps {
  vaults: VaultData[];
  isConnected: boolean;
  balance: { usdc: number };
  activeVaultId: string | null;
  onVaultHover: (id: string) => void;
}

// Create a memoized version of the VaultCard to prevent unnecessary rerenders
const MemoizedVaultCard = memo(VaultCard);

export function VaultGrid({
  vaults,
  isConnected,
  balance,
  activeVaultId,
  onVaultHover
}: VaultGridProps) {
  // Ensure balance is never undefined
  const safeBalance = balance || { usdc: 0 };

  return (
    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vaults.map((vault: VaultData) => (
        <MemoizedVaultCard
          key={vault.id}
          vault={vault}
          isConnected={isConnected}
          hasBalance={safeBalance.usdc > 0}
          isActive={activeVaultId === vault.id}
          onHover={() => onVaultHover(vault.id)}
        />
      ))}
    </div>
  );
}

// Also export a memoized version of VaultGrid for higher-level optimization
export const MemoizedVaultGrid = memo(VaultGrid);
