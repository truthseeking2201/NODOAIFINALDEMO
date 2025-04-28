import React, { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ReceiptTokenCard } from "@/components/dashboard/ReceiptTokenCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PositionsPanel } from "@/components/dashboard/PositionsPanel";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { RedeemNODOAIxDrawer } from "@/components/vault/RedeemNODOAIxDrawer";
import { TxDrawer } from "@/components/dashboard/TxDrawer";

export default function Dashboard() {
  const { isConnected, balance } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRedeemDrawerOpen, setIsRedeemDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);

  const { data: investments, isLoading: loadingInvestments } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected,
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected,
  });

  // Calculate performance data for chart
  const performanceData = useMemo(() => {
    if (!activities) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const totalPrincipal = investments?.reduce((sum, inv) => sum + inv.principal, 0) || 0;

    const data = [];
    for (let i = 0; i <= 29; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayFactor = i / 29;
      const growthFactor = 1 + (Math.sin(i/5) * 0.01) + (dayFactor * 0.08);
      const baseValue = totalPrincipal * growthFactor;

      // Handle transactions in the new TransactionHistory format
      const depositsOnThisDay = activities?.filter(tx =>
        tx.type === 'deposit' && tx.timestamp.split('T')[0] === dateStr
      ) || [];

      const depositAmount = depositsOnThisDay.reduce((sum, tx) => sum + tx.amount, 0);

      data.push({
        date: dateStr,
        value: baseValue,
        profit: baseValue - totalPrincipal,
        deposit: depositAmount > 0 ? depositAmount : undefined
      });
    }

    return data;
  }, [activities, investments]);

  // Handle withdraw click
  const handleWithdrawClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setIsWithdrawModalOpen(true);
  };

  // Handle redeem NODOAIx click
  const handleRedeemClick = () => {
    setIsRedeemDrawerOpen(true);
  };

  // Handle transaction selection
  const handleTxSelect = (tx: TransactionHistory) => {
    setSelectedTx(tx);
    setIsTxDrawerOpen(true);
  };

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  // Calculate total metrics
  const totalValue = investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const totalProfit = investments?.reduce((sum, inv) => sum + inv.profit, 0) || 0;

  return (
    <PageContainer className="dashboard-container mx-auto max-w-7xl pb-20">
      <DashboardHeader
        totalValue={totalValue}
        totalProfit={totalProfit}
      />

      <div className="dashboard-grid space-y-8">
        <MetricsOverview
          investments={investments || []}
          isLoading={loadingInvestments}
        />

        {balance?.receiptTokens > 0 && (
          <ReceiptTokenCard
            tokens={balance.receiptTokens}
            onRedeem={handleRedeemClick}
          />
        )}

        <PerformanceChart
          data={performanceData}
          transactions={activities}
          isLoading={loadingInvestments || loadingActivities}
          onTxClick={handleTxSelect}
        />

        <PositionsPanel
          positions={investments || []}
          isLoading={loadingInvestments}
          onWithdraw={handleWithdrawClick}
        />

        <ActivityPanel
          activities={activities || []}
          isLoading={loadingActivities}
        />
      </div>

      {/* Transaction Drawer */}
      <TxDrawer
        tx={selectedTx}
        open={isTxDrawerOpen}
        onClose={() => setIsTxDrawerOpen(false)}
      />

      {/* Withdraw Modal */}
      {selectedInvestment && (
        <WithdrawModal
          open={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          investment={selectedInvestment}
        />
      )}

      {/* Redeem NODOAIx Drawer */}
      <RedeemNODOAIxDrawer
        open={isRedeemDrawerOpen}
        onClose={() => setIsRedeemDrawerOpen(false)}
      />
    </PageContainer>
  );
}
