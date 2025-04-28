import React from "react";
import { motion } from "framer-motion";
import { VaultData } from "@/types/vault";
import { EnhancedVaultCard } from "./EnhancedVaultCard";

interface VaultGridProps {
  vaults: VaultData[];
  isConnected: boolean;
  balance?: { usdc: number };
  activeVaultId: string | null;
  onVaultHover: (id: string) => void;
}

export function EnhancedVaultGrid({
  vaults,
  isConnected,
  balance,
  activeVaultId,
  onVaultHover
}: VaultGridProps) {
  // Create staggered animation for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {vaults.map((vault) => (
        <motion.div key={vault.id} variants={itemVariants}>
          <EnhancedVaultCard
            vault={vault}
            isActive={activeVaultId === vault.id}
            onHover={onVaultHover}
            isConnected={isConnected}
            balance={balance}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
