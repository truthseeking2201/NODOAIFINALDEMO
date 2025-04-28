import React, { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ReceiptTokenCard } from "@/components/dashboard/ReceiptTokenCard";
import { PositionsPanel } from "@/components/dashboard/PositionsPanel";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
// Import the simplified dashboard instead of the complex one
import { SimplifiedAIInsightsDashboard } from "@/components/dashboard/SimplifiedAIInsightsDashboard";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { RedeemNODOAIxDrawer } from "@/components/vault/RedeemNODOAIxDrawer";
import { TxDrawer } from "@/components/dashboard/TxDrawer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  BarChart,
  Settings,
  ArrowUpRight,
  ChevronRight,
  Zap,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// A simpler ErrorBoundary that shouldn't conflict with the one in AIInsightsDashboard
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Dashboard() {
  const { isConnected, balance } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRedeemDrawerOpen, setIsRedeemDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("classic");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

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

  // Hide welcome modal after a delay
  useEffect(() => {
    if (showWelcomeModal) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeModal]);

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
    <PageContainer className="dashboard-container mx-auto pb-20 relative">
      {/* Welcome message for AI Dashboard */}
      {showWelcomeModal && activeTab === "ai" && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-black/80 backdrop-blur-md border border-nova/30 shadow-lg shadow-nova/20 rounded-lg p-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 rounded-full bg-nova/20 flex items-center justify-center">
              <Brain size={20} className="text-nova" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Welcome to AI Dashboard</h3>
          <p className="text-white/70 text-sm mb-3">
            Experience our new AI-powered insights and automated optimization tools.
          </p>
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setShowWelcomeModal(false)}
            >
              Got it
            </Button>
          </div>
        </motion.div>
      )}

      {/* Dashboard Header */}
      <DashboardHeader
        totalValue={totalValue}
        totalProfit={totalProfit}
      />

      {/* Dashboard View Toggle */}
      <div className="mb-6 flex justify-end">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1"
        >
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="classic"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
            >
              <BarChart size={16} className="mr-2" />
              Classic View
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
            >
              <Brain size={16} className="mr-2" />
              AI Dashboard
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* View Content */}
      <div className="relative">
        {/* Classic Dashboard */}
        {activeTab === "classic" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="dashboard-grid space-y-8"
          >
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

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-nova/10 flex items-center justify-center">
                    <Zap size={16} className="text-nova" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">AI-Powered View Available</h3>
                    <p className="text-sm text-white/60">Try our enhanced dashboard with AI insights and optimization</p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("ai")}
                  className="bg-gradient-to-r from-nova-600 to-nova-500"
                >
                  <Brain size={16} className="mr-2" />
                  Switch to AI View
                </Button>
              </div>
            </div>

            <PositionsPanel
              positions={investments || []}
              isLoading={loadingInvestments}
              onWithdraw={handleWithdrawClick}
            />

            <ActivityPanel
              activities={activities || []}
              isLoading={loadingActivities}
            />
          </motion.div>
        )}

        {/* AI Dashboard */}
        {activeTab === "ai" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardErrorBoundary
              fallback={
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <AlertTriangle size={32} className="text-orion" />
                    <h3 className="text-xl font-medium text-white">AI Dashboard Error</h3>
                    <p className="text-white/70">
                      We encountered an issue loading the AI Dashboard. We're working on a fix.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={() => setActiveTab("classic")}
                    >
                      <BarChart size={16} className="mr-2" />
                      Switch to Classic View
                    </Button>
                  </div>
                </div>
              }
            >
              <SimplifiedAIInsightsDashboard />
            </DashboardErrorBoundary>

            {/* Quick access to classic view */}
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-black/20 hover:bg-black/30 text-white/70"
                onClick={() => setActiveTab("classic")}
              >
                <BarChart size={14} className="mr-2" />
                Switch to Classic View
              </Button>
            </div>
          </motion.div>
        )}
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
