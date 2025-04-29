import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VaultData } from "@/types/vault";
import { WalletSignatureDialog } from "@/components/wallet/WalletSignatureDialog";

interface DepositDrawerReviewProps {
  vault: VaultData;
  amount: string;
  selectedLockup: number;
  returnAmount: number;
  totalReturn: number;
  isPending: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function DepositDrawerReview({
  vault,
  amount,
  selectedLockup,
  returnAmount,
  totalReturn,
  isPending,
  onConfirm,
  onBack
}: DepositDrawerReviewProps) {
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const gasFeeNative = 0.006;
  const gasFeeUsd = 0.02;

  const formatUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return `Unlocks in ${selectedLockup} days (${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`;
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value?: number) => {
    return value !== undefined ? `${value.toFixed(1)}%` : '-';
  };

  const handleConfirmClick = () => {
    setShowWalletDialog(true);
  };

  const handleWalletSignatureComplete = () => {
    setShowWalletDialog(false);
    onConfirm();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white/[0.02] rounded-[20px] p-5 border border-white/[0.06]">
        <h3 className="text-base font-medium text-center mb-4">Confirm Your Deposit</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Vault</span>
            <span className="font-medium text-sm text-[#F59E0B]">{vault.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Amount</span>
            <span className="font-mono text-sm text-[#E5E7EB]">{formatCurrency(parseFloat(amount))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Lock-up Period</span>
            <span className="font-mono text-sm text-[#E5E7EB]">{selectedLockup} days</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">APR</span>
            <span className="font-mono text-sm text-[#F59E0B]">
              {formatPercentage(vault.apr + (vault.lockupPeriods.find(p => p.days === selectedLockup)?.aprBoost || 0))}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Unlock Date</span>
            <span className="text-sm text-[#E5E7EB]">{formatUnlockDate()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Gas (est.)</span>
            <span className="font-mono text-sm text-[#E5E7EB]">{gasFeeNative} SUI (${gasFeeUsd})</span>
          </div>

          <div className="h-px bg-white/[0.06] my-2"></div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Est. Return</span>
            <span className="font-mono text-sm text-[#10B981]">
              {formatCurrency(returnAmount)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Est. Total Value</span>
            <span className="font-mono font-medium text-sm text-[#E5E7EB]">
              {formatCurrency(totalReturn)}
            </span>
          </div>

          {/* Compact NODOAIx Token Info */}
          <div className="mt-1 p-2 bg-[#FF8800]/10 rounded-lg flex items-center justify-between border border-[#FF8800]/20">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">AIx</span>
              </div>
              <span className="text-xs text-white/80">NODOAIx Tokens</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold text-[#FFA822]">{Math.floor(parseFloat(amount) * 0.8)}</span>
              <span className="text-[10px] text-green-500">≈${(parseFloat(amount) * 0.8 * 0.043).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#6B7280] mt-3">
          APR may vary with pool fees.
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleConfirmClick}
          disabled={isPending}
          className="w-full h-[52px] rounded-xl font-mono text-sm bg-gradient-to-r from-[#FF8800] to-[#FFA822] hover:shadow-[0_4px_12px_-2px_rgba(255,136,0,0.4)] transition-all duration-300 hover:scale-[0.98]"
        >
          Confirm Deposit
        </Button>

        <Button
          variant="outline"
          className="bg-white/5 border-[#374151] hover:bg-white/10 h-12 rounded-xl"
          disabled={isPending}
          onClick={onBack}
        >
          Back
        </Button>
      </div>

      <WalletSignatureDialog
        open={showWalletDialog}
        onComplete={handleWalletSignatureComplete}
        transactionType="deposit"
        amount={amount}
        vaultName={vault.name}
      />
    </div>
  );
}
