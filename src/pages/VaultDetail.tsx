import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultDetailSkeleton } from "@/components/vault/VaultDetailSkeleton";
import { VaultDetailError } from "@/components/vault/VaultDetailError";
import { VaultDetailHeader } from "@/components/vault/VaultDetailHeader";
import { VaultDetailLayout } from "@/components/vault/VaultDetailLayout";
import { VaultPerformanceSection } from "@/components/vault/VaultPerformanceSection";
import { VaultMetricsCard } from "@/components/vault/VaultMetricsCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { DepositDrawer } from "@/components/vault/DepositDrawer";
import { VaultStickyBar } from "@/components/vault/VaultStickyBar";
import { useVaultDetail } from "@/hooks/useVaultDetail";
import { useWallet } from "@/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaultSecurityInfo } from "@/components/vault/VaultSecurityInfo";
import { VaultData } from "@/types/vault";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { NeuralNetworkBackground } from "@/components/vault/NeuralNetworkBackground";
import { AITransactionTicker } from "@/components/vault/AITransactionTicker";
import { AIStrategyVisualizer } from "@/components/vault/AIStrategyVisualizer";
import { AIQueryAssistant } from "@/components/vault/AIQueryAssistant";
import { AIActivityNotification } from "@/components/vault/AIActivityNotification";
import {
  Brain,
  Shield,
  TrendingUp,
  InfoIcon,
  Ticket,
  Coins,
  ExternalLink,
  Zap,
  LineChart,
  BarChart4,
  Cpu,
  Lightbulb,
  Network,
  Lock
} from "lucide-react";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [projectedAmount, setProjectedAmount] = useState<string>("1000");
  const [unlockProgress, setUnlockProgress] = useState<number>(0);
  const [tokensBalance, setTokensBalance] = useState<number>(1000);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [pulseEffect, setPulseEffect] = useState<boolean>(false);
  const [unlockTime] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // 24 hours from now
  const nodoaixCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState("strategy");
  const [customVaultData, setCustomVaultData] = useState<VaultData | null>(null);
  const [wasManuallyClosedRef, setWasManuallyClosedRef] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [showAiInsight, setShowAiInsight] = useState(false);

  // Animation effect for NODOAIx Token count
  useEffect(() => {
    const targetValue = tokensBalance;
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of steps in animation
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      // Easing function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValue(targetValue * easeProgress);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValue(targetValue);

        // Add pulse effect after animation completes
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [tokensBalance]);

  // Add scroll animation variables similar to the catalog page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  const {
    vault,
    isLoading,
    error,
    getVaultStyles
  } = useVaultDetail(vaultId || '');

  // Handle AI insights from the visualizer
  const handleOptimizationEvent = (event: string) => {
    setAiInsight(event);
    setShowAiInsight(true);

    // Hide after a few seconds
    setTimeout(() => {
      setShowAiInsight(false);
    }, 5000);
  };

  useEffect(() => {
    if (isConnected && hasInteracted && !isDepositDrawerOpen && !wasManuallyClosedRef) {
      setIsDepositDrawerOpen(true);
    }
  }, [isConnected, hasInteracted, isDepositDrawerOpen, wasManuallyClosedRef]);

  useEffect(() => {
    const handleDepositSuccess = (e: CustomEvent) => {
      if (nodoaixCardRef.current) {
        nodoaixCardRef.current.classList.add('glow-animation');
        setTimeout(() => {
          nodoaixCardRef.current?.classList.remove('glow-animation');
        }, 2000);
      }
    };

    const handleOpenDepositDrawer = (e: CustomEvent) => {
      if (e.detail && e.detail.vault) {
        setCustomVaultData(e.detail.vault);
        setIsDepositDrawerOpen(true);
      }
    };

    window.addEventListener('deposit-success', handleDepositSuccess as EventListener);
    window.addEventListener('open-deposit-drawer', handleOpenDepositDrawer as EventListener);

    return () => {
      window.removeEventListener('deposit-success', handleDepositSuccess as EventListener);
      window.removeEventListener('open-deposit-drawer', handleOpenDepositDrawer as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDepositDrawerOpen) {
        setIsDepositDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDepositDrawerOpen]);

  const handleActionClick = () => {
    setHasInteracted(true);
    if (isConnected) {
      setIsDepositDrawerOpen(true);
    } else {
      const walletBtn = document.querySelector('[data-wallet-connect="true"]');
      if (walletBtn) {
        (walletBtn as HTMLElement).click();
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDepositDrawerOpen(false);
    setCustomVaultData(null);
    setWasManuallyClosedRef(true);
  };

  if (isLoading) {
    return <VaultDetailSkeleton />;
  }

  if (error || !vault) {
    return <VaultDetailError />;
  }

  const styles = getVaultStyles(vault.type);

  return (
    <PageContainer className="min-h-screen overflow-x-hidden bg-[#0A0B0D]">
      <div ref={containerRef} className="relative z-0">
        {/* Neural network background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Advanced Neural Network Visualization */}
          <NeuralNetworkBackground
            nodeCount={40}
            connectionDensity={0.2}
            nodesColor={vault.type === 'nova' ? "rgba(249, 115, 22, 0.6)" :
                       vault.type === 'orion' ? "rgba(245, 158, 11, 0.6)" :
                       "rgba(16, 185, 129, 0.6)"}
            connectionsColor={vault.type === 'nova' ? "rgba(249, 115, 22, 0.15)" :
                            vault.type === 'orion' ? "rgba(245, 158, 11, 0.15)" :
                            "rgba(16, 185, 129, 0.15)"}
            activeNodeColor={vault.type === 'nova' ? "rgba(249, 115, 22, 0.9)" :
                            vault.type === 'orion' ? "rgba(245, 158, 11, 0.9)" :
                            "rgba(16, 185, 129, 0.9)"}
            flowSpeed={0.8}
            className="opacity-30"
          />

          {/* Gradient orbs for additional depth */}
          <motion.div
            className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full ${
              vault.type === 'nova' ? 'bg-nova/10' :
              vault.type === 'orion' ? 'bg-orion/10' :
              'bg-emerald/10'
            } blur-[120px]`}
            style={{ y: y1 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute top-60 -right-40 w-[500px] h-[500px] rounded-full ${
              vault.type === 'nova' ? 'bg-orange-500/10' :
              vault.type === 'orion' ? 'bg-amber-500/10' :
              'bg-green-500/10'
            } blur-[120px]`}
            style={{ y: y2 }}
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* AI Insight notification */}
        <AnimatePresence>
          {showAiInsight && aiInsight && (
            <motion.div
              className="fixed top-20 right-6 z-50 max-w-sm"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-4 rounded-xl shadow-lg backdrop-blur-md border ${
                vault.type === 'nova' ? 'bg-nova/10 border-nova/30' :
                vault.type === 'orion' ? 'bg-orion/10 border-orion/30' :
                'bg-emerald/10 border-emerald/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    vault.type === 'nova' ? 'bg-gradient-to-br from-nova/20 to-transparent' :
                    vault.type === 'orion' ? 'bg-gradient-to-br from-orion/20 to-transparent' :
                    'bg-gradient-to-br from-emerald/20 to-transparent'
                  }`}>
                    <Brain size={18} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">AI Insight</h4>
                    <p className="text-xs text-white/80 mt-0.5">{aiInsight}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VaultDetail Header with enhanced styling */}
        <motion.section
          className="py-4 md:py-6 relative"
          style={{ opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <VaultDetailHeader vaultName={vault.name} styles={styles} />
        </motion.section>

        {/* Neural Activity Ticker Bar */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className={`w-full h-12 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center px-4 overflow-hidden`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                vault.type === 'nova' ? 'bg-nova/10' :
                vault.type === 'orion' ? 'bg-orion/10' :
                'bg-emerald/10'
              }`}>
                <Network size={14} className={
                  vault.type === 'nova' ? 'text-nova' :
                  vault.type === 'orion' ? 'text-orion' :
                  'text-emerald'
                } />
              </div>
              <div className="text-sm font-medium text-white">
                AI Working For You:
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative ml-3">
              <motion.div
                className="whitespace-nowrap text-white/70 text-sm flex items-center gap-4"
                animate={{
                  x: [0, -1000]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <span className="flex items-center gap-1">
                  <Brain size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Finding the best money-making opportunities
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <LineChart size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Making your investment work smarter
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <Shield size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Keeping your money safe 24/7
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <Zap size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Just found a way to earn {(Math.random() * 0.4 + 0.1).toFixed(2)}% more interest
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <Cpu size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  AI is finding better ways to grow your money
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <BarChart4 size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Market trend looking: {Math.random() > 0.5 ? 'positive' : 'stable'} for your returns
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30"></span>
                <span className="flex items-center gap-1">
                  <Lock size={12} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                  Extra security measures active to protect your funds
                </span>
              </motion.div>

              {/* Fade gradient effect */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0A0B0D] to-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Layout with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Performance Card */}
              <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                <VaultPerformanceSection
                  vault={vault}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  styles={styles}
                />
              </div>

              {/* AI Strategy Visualizer */}
              <AIStrategyVisualizer vaultType={vault.type} />

              {/* AI Transaction Ticker */}
              <AITransactionTicker vaultType={vault.type} />

              {/* Strategy & Security Card - Now with AI-focused info */}
              <Card className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative">
                {/* Gradient background based on vault type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  vault.type === 'nova' ? 'from-nova/20 via-nova/5 to-transparent' :
                  vault.type === 'orion' ? 'from-orion/20 via-orion/5 to-transparent' :
                  'from-emerald/20 via-emerald/5 to-transparent'
                } opacity-50`} />

                {/* Card content with backdrop blur */}
                <div className="relative bg-black/50 backdrop-blur-md">
                  <CardHeader className="p-6 pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                        vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                        'bg-gradient-to-br from-emerald/30 to-emerald/10'
                      }`}>
                        <Lightbulb size={20} className={
                          vault.type === 'nova' ? 'text-nova' :
                          vault.type === 'orion' ? 'text-orion' :
                          'text-emerald'} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold mb-0.5">How Your Investment Works</CardTitle>
                        <CardDescription className="text-sm text-white/60">
                          Investment strategy and security features
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Tabs defaultValue="strategy" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 mb-6 bg-white/5 rounded-lg p-1">
                        <TabsTrigger
                          value="strategy"
                          className={`data-[state=active]:${
                            vault.type === 'nova' ? 'bg-nova/20 data-[state=active]:text-nova' :
                            vault.type === 'orion' ? 'bg-orion/20 data-[state=active]:text-orion' :
                            'bg-emerald/20 data-[state=active]:text-emerald'
                          }`}
                        >
                          How It Works
                        </TabsTrigger>
                        <TabsTrigger
                          value="security"
                          className={`data-[state=active]:${
                            vault.type === 'nova' ? 'bg-nova/20 data-[state=active]:text-nova' :
                            vault.type === 'orion' ? 'bg-orion/20 data-[state=active]:text-orion' :
                            'bg-emerald/20 data-[state=active]:text-emerald'
                          }`}
                        >
                          Safety Features
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="strategy" className="mt-0 space-y-4">
                        <div className="space-y-3">
                          <h3 className="text-base font-medium text-text-primary flex items-center gap-2">
                            <Brain size={16} className={
                              vault.type === 'nova' ? 'text-nova' :
                              vault.type === 'orion' ? 'text-orion' :
                              'text-emerald'
                            } />
                            Investment Strategy
                          </h3>
                          <p className="text-text-secondary text-sm leading-relaxed">
                            {vault.strategy}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <div className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                                <Network size={12} className={
                                  vault.type === 'nova' ? 'text-nova' :
                                  vault.type === 'orion' ? 'text-orion' :
                                  'text-emerald'
                                } />
                                Processing Power
                              </div>
                              <div className="text-base font-mono font-medium">
                                {vault.type === 'nova' ? '24' : vault.type === 'orion' ? '18' : '12'} Layers
                              </div>
                              <div className="mt-1 text-[10px] text-white/50">
                                Advanced analysis capabilities
                              </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <div className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                                <Cpu size={12} className={
                                  vault.type === 'nova' ? 'text-nova' :
                                  vault.type === 'orion' ? 'text-orion' :
                                  'text-emerald'
                                } />
                                System Speed
                              </div>
                              <div className="text-base font-mono font-medium">
                                {vault.type === 'nova' ? '128' : vault.type === 'orion' ? '96' : '64'} Units
                              </div>
                              <div className="mt-1 text-[10px] text-white/50">
                                Faster processing for better results
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-base font-medium text-text-primary flex items-center gap-2">
                            <TrendingUp size={16} className={
                              vault.type === 'nova' ? 'text-nova' :
                              vault.type === 'orion' ? 'text-orion' :
                              'text-emerald'
                            } />
                            Risk Assessment
                          </h3>
                          <div className="flex items-center gap-4">
                            <span className={`
                              inline-block px-4 py-1 rounded-full text-sm font-medium
                              ${vault.riskLevel === 'low' ? 'bg-emerald/30 text-emerald' :
                                vault.riskLevel === 'medium' ? 'bg-orion/30 text-orion' :
                                'bg-nova/30 text-nova'}
                            `}>
                              {vault.riskLevel.charAt(0).toUpperCase() + vault.riskLevel.slice(1)}
                            </span>
                            <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  vault.riskLevel === 'low' ? 'bg-emerald w-1/4' :
                                  vault.riskLevel === 'medium' ? 'bg-orion w-1/2' :
                                  'bg-red-500 w-3/4'
                                }`}
                              ></div>
                            </div>
                          </div>

                          <div className="bg-black/20 p-3 rounded-lg border border-white/5 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={14} className={
                                vault.type === 'nova' ? 'text-nova' :
                                vault.type === 'orion' ? 'text-orion' :
                                'text-emerald'
                              } />
                              <span className="text-sm font-medium text-white">Security Approach</span>
                            </div>
                            <p className="text-xs text-white/70">
                              {vault.type === 'nova' ?
                                'Our system monitors market conditions continuously and responds quickly to protect your investment during market volatility.' :
                                vault.type === 'orion' ?
                                'This vault adapts investment strategies based on market conditions, balancing growth potential with appropriate risk management.' :
                                'This conservative vault prioritizes capital preservation first, automatically adjusting positions to minimize risk during uncertain markets.'
                              }
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="security" className="mt-0">
                        <VaultSecurityInfo
                          contractAddress="0x1234567890abcdef1234567890abcdef12345678"
                          isAudited={true}
                          explorerUrl="https://explorer.sui.io/address/0x1234567890abcdef1234567890abcdef12345678"
                          defaultOpen={true}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Deposit/Vault Metrics Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg"
              >
                {/* Gradient background based on vault type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  vault.type === 'nova' ? 'from-nova/20 via-nova/5 to-transparent' :
                  vault.type === 'orion' ? 'from-orion/20 via-orion/5 to-transparent' :
                  'from-emerald/20 via-emerald/5 to-transparent'
                } opacity-50`} />

                {/* Card content with backdrop blur */}
                <div className="relative bg-[#060708] backdrop-blur-md">
                  <VaultMetricsCard
                    vault={vault}
                    styles={styles}
                    projectedAmount={projectedAmount}
                    onProjectedAmountChange={setProjectedAmount}
                    isConnected={isConnected}
                    onActionClick={handleActionClick}
                  />
                </div>
              </motion.div>

              {/* NODOAIx Token Card */}
              <motion.div
                ref={nodoaixCardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg"
              >
                {/* Gradient background based on vault type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  vault.type === 'nova' ? 'from-nova/20 via-nova/5 to-transparent' :
                  vault.type === 'orion' ? 'from-orion/20 via-orion/5 to-transparent' :
                  'from-emerald/20 via-emerald/5 to-transparent'
                } opacity-50`} />

                {/* Card content with backdrop blur */}
                <div className="relative bg-[#060708] backdrop-blur-md">
                  <Card className="overflow-hidden rounded-xl border-0 relative">

                    <CardHeader className="p-6 pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                          vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                          'bg-gradient-to-br from-emerald/30 to-emerald/10'
                        }`}>
                          <Coins size={20} className={
                            vault.type === 'nova' ? 'text-nova' :
                            vault.type === 'orion' ? 'text-orion' :
                            'text-emerald'} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold flex items-center justify-between">
                            <span>Your Vault Tokens</span>
                          </CardTitle>
                          <CardDescription className="text-sm text-white/60">
                            Investment position tracking
                          </CardDescription>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
                                <InfoIcon className="h-4 w-4 text-white/40 cursor-help" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] p-4 bg-[#0c0c10]/95 border border-white/20 text-white">
                              <h4 className="font-medium text-sm mb-2 text-amber-500">About Your Vault Tokens</h4>
                              <p className="text-sm text-white/80">
                                These tokens represent your share of the vault. They're stored securely in your wallet and their value increases as the vault generates returns. You can redeem them anytime to withdraw your funds.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-5">
                      <div className="grid grid-cols-2 gap-4 mb-1">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <p className="text-xs text-white/60 mb-1">Deposit</p>
                          <p className="text-base font-medium font-mono">$1000.00</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <p className="text-xs text-white/60 mb-1">Fee</p>
                          <p className="text-base font-medium font-mono">$12.30</p>
                        </div>
                      </div>

                      <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-white/60">Unlock Period: <span className="text-white/80">{Math.ceil((unlockTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span></p>
                          <p className="text-xs font-medium font-mono">{unlockProgress}% complete</p>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                              vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                              'bg-gradient-to-r from-emerald to-green-500'
                            }`}
                            style={{ width: `${unlockProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex items-center">
                          <div className="receipt-token-icon relative mr-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                              <motion.div
                                animate={{
                                  scale: pulseEffect ? [1, 1.2, 1] : 1,
                                  opacity: pulseEffect ? [1, 0.7, 1] : 1
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">AIx</span>
                                </div>
                              </motion.div>
                            </div>

                            {/* Pulsing rings effect */}
                            <AnimatePresence>
                              {pulseEffect && (
                                <motion.div
                                  initial={{ scale: 1, opacity: 0.7 }}
                                  animate={{ scale: 1.5, opacity: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 1 }}
                                  className="absolute inset-0 rounded-full border border-amber-500/50"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                          <div>
                            <div className="text-2xl font-mono font-bold text-amber-500">
                              {animatedValue.toFixed(2)}
                            </div>
                            <div className="text-xs text-white/60">
                              Token balance
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Total Users</span>
                          <span className="font-mono">1,203</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Contract Address</span>
                          <span className="font-mono text-white/80 flex items-center">
                            0xAB12...3456
                            <ExternalLink className="ml-1 h-3 w-3 text-white/60" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add AI Activity Notifications */}
      <AIActivityNotification
        vaultType={vault.type}
      />

      {/* Add AI Assistant chat bot */}
      <AIQueryAssistant
        vaultType={vault.type}
        vaultName={vault.name}
      />

      <VaultStickyBar
        isConnected={isConnected}
        styles={styles}
        onActionClick={handleActionClick}
      />

      <DepositDrawer
        open={isDepositDrawerOpen}
        onClose={handleCloseDrawer}
        vault={customVaultData || vault}
      />
    </PageContainer>
  );
}
