import React, { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ReceiptTokenCard } from "@/components/dashboard/ReceiptTokenCard";
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
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";



export default function Dashboard() {
  const { isConnected, balance } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRedeemDrawerOpen, setIsRedeemDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);
  const [isPageMounted, setIsPageMounted] = useState(false);

  // Mark component as mounted to ensure all hooks and data are properly initialized
  useEffect(() => {
    setIsPageMounted(true);

    // Signal that dashboard is ready to the parent component
    return () => {
      // Cleanup
    };
  }, []);

  // Always ensure the cache is cleared on dashboard load to get fresh mock data
  useEffect(() => {
    vaultService.clearCache();
  }, []);

  const { data: investments, isLoading: loadingInvestments } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected && isPageMounted,
    staleTime: 60000, // Cache data for 1 minute
    retry: 3, // Retry failed requests more times
    refetchOnWindowFocus: false,
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected && isPageMounted,
    staleTime: 60000, // Cache data for 1 minute
    retry: 3, // Retry failed requests more times
    refetchOnWindowFocus: false,
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

  // Use mock data if investments are not loaded
  const mockInvestments: UserInvestment[] = [
    {
      vaultId: "deep-sui",
      principal: 500,
      shares: 48.25,
      depositDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      lockupPeriod: 60,
      unlockDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      currentValue: 536.50,
      profit: 36.50,
      isWithdrawable: false,
      currentApr: 24.8
    },
    {
      vaultId: "cetus-sui",
      principal: 750,
      shares: 73.12,
      depositDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lockupPeriod: 30,
      unlockDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentValue: 771.25,
      profit: 21.25,
      isWithdrawable: true,
      currentApr: 18.7
    }
  ];

  // Always ensure we have investment data for the metrics
  const investmentsData = investments && investments.length > 0 ? investments : mockInvestments;

  // Calculate total metrics using the data we have
  const totalValue = investmentsData.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = investmentsData.reduce((sum, inv) => sum + inv.profit, 0);

  return (
    <PageContainer className="dashboard-container mx-auto pb-20 relative">


      {/* Dashboard Header */}
      <DashboardHeader
        totalValue={totalValue}
        totalProfit={totalProfit}
      />



      {/* Dashboard Content */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="dashboard-grid space-y-8"
        >
          <MetricsOverview
            investments={investmentsData}
            isLoading={loadingInvestments}
          />

          {/* Always show receipt tokens in demo mode */}
          <ReceiptTokenCard
            tokens={balance?.receiptTokens || 125.2}
            onRedeem={handleRedeemClick}
          />

          <PositionsPanel
            positions={investmentsData}
            isLoading={loadingInvestments && investmentsData.length === 0}
            onWithdraw={handleWithdrawClick}
          />

          <ActivityPanel
            activities={activities || []}
            isLoading={loadingActivities && (!activities || activities.length === 0)}
          />
        </motion.div>
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
