import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultDetailError } from "@/components/vault/VaultDetailError";
import { VaultDetailHeader } from "@/components/vault/VaultDetailHeader";
import { VaultPerformanceSection } from "@/components/vault/VaultPerformanceSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { AIConfidenceScore } from "@/components/vault/AIConfidenceScore";
import { NeuroProcessingVisualizer } from "@/components/vault/NeuroProcessingVisualizer";
import { AIControlPanel } from "@/components/vault/AIControlPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TranslatedSection } from "@/components/shared/TranslatedSection";
import { TranslatedText } from "@/components/shared/TranslatedText";
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
  Lock,
  ChevronDown,
  BarChart,
  ArrowUpRight,
  ChartPie,
  ArrowDownRight,
  CircleOff,
  Sparkles,
  Clock
} from "lucide-react";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [projectedAmount, setProjectedAmount] = useState<string>("1000");
  const [unlockProgress, setUnlockProgress] = useState<number>(42);
  const [tokensBalance, setTokensBalance] = useState<number>(1000);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [pulseEffect, setPulseEffect] = useState<boolean>(false);
  const [unlockTime] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000 * 12)); // 12 days from now
  const nodoaixCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState("strategy");
  const [customVaultData, setCustomVaultData] = useState<VaultData | null>(null);
  const [wasManuallyClosedRef, setWasManuallyClosedRef] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [aiConfidenceScore, setAiConfidenceScore] = useState<number>(92);
  const [neuroProcessingScore, setNeuroProcessingScore] = useState<number>(87);
  const [optimizationEvents, setOptimizationEvents] = useState<string[]>([
    "Found profit opportunity between SUI/USDC pairs",
    "Rebalanced positions to maximize returns",
    "Adjusted liquidity allocation based on market trend analysis"
  ]);

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

  // Add scroll animation variables
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

  // Force clearing cache and data refresh on mount
  useEffect(() => {
    if (vaultId) {
      // Clear the cache to ensure fresh data
      import("@/services/vaultService").then(module => {
        module.vaultService.clearCache();
      }).catch(err => console.error("Failed to clear vault cache:", err));

      // Simulate unlocking progress over time
      const interval = setInterval(() => {
        setUnlockProgress(prev => Math.min(prev + 1, 100));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [vaultId]);

  // Simulate changing AI confidence and Neuro Processing scores
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = Math.random() * 4 - 2;
      setAiConfidenceScore(prev => Math.min(Math.max(prev + randomChange, 75), 99));

      const neuroChange = Math.random() * 3 - 1;
      setNeuroProcessingScore(prev => Math.min(Math.max(prev + neuroChange, 70), 98));

      if (Math.random() > 0.7) {
        const newEvent = generateOptimizationEvent();
        setOptimizationEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateOptimizationEvent = () => {
    const events = [
      "Detected market inefficiency and adjusted strategy",
      "Optimized gas costs for higher net returns",
      "Adjusted position to reduce impermanent loss risk",
      "Found higher yield opportunity and reallocated funds",
      "Neural analysis identified emerging market trend",
      "Automated risk assessment adjusted exposure levels",
      "Liquidity pool optimization complete",
      "Predicted volatility increase and hedged positions"
    ];
    return events[Math.floor(Math.random() * events.length)];
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

  // Skip loading state but keep error handling
  if (isLoading) {
    return null; // Return nothing during loading instead of a loading skeleton
  }

  if (error || !vault) {
    return <VaultDetailError />;
  }

  const styles = getVaultStyles(vault.type);

  // Get color values for consistent styling
  const getColors = () => {
    switch (vault.type) {
      case 'nova': return {
        primary: '#f97316',
        secondary: '#f59e0b',
      };
      case 'orion': return {
        primary: '#f59e0b',
        secondary: '#eab308',
      };
      case 'emerald': return {
        primary: '#10b981',
        secondary: '#22c55e',
      };
    }
  };

  const colors = getColors();

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



        {/* VaultDetail Header with enhanced styling */}
        <motion.section
          className="py-4 md:py-6 relative"
          style={{ opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <VaultDetailHeader vaultName={vault.name} styles={styles} />

          {/* Show AI Insights Filter */}
          <div className="px-4 mb-2 flex justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/60">Show AI Insights</span>
              <button
                className={`w-10 h-5 rounded-full relative focus:outline-none ${showAiInsights ? 'bg-green-500' : 'bg-gray-600'}`}
                onClick={() => setShowAiInsights(!showAiInsights)}
              >
                <span
                  className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${showAiInsights ? 'transform translate-x-5' : ''}`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Neural Activity Ticker Bar */}
        {showAiInsights && (
          <motion.div
            className="px-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
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
              </motion.div>

              {/* Fade gradient effect */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0A0B0D] to-transparent"></div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Main Content Layout with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 mb-24">
            {/* Deposit Section - Sticky on Desktop, Always Visible */}
            <div className="lg:col-span-4 lg:order-2">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Deposit/Vault Metrics Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="relative overflow-hidden rounded-xl border-2 border-white/30 shadow-xl z-10"
                >
                  {/* Highlight glow effect */}
                  <div className="absolute inset-0 opacity-75">
                    <div className={`absolute inset-0 ${
                      vault.type === 'nova' ? 'bg-nova/20' :
                      vault.type === 'orion' ? 'bg-orion/20' :
                      'bg-emerald/20'
                    } blur-md`}></div>
                  </div>

                  {/* Gradient background based on vault type */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    vault.type === 'nova' ? 'from-nova/20 via-nova/5 to-transparent' :
                    vault.type === 'orion' ? 'from-orion/20 via-orion/5 to-transparent' :
                    'from-emerald/20 via-emerald/5 to-transparent'
                  } opacity-60`} />

                  {/* Card content with backdrop blur */}
                  <div className="relative bg-[#060708] backdrop-blur-md p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                        vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                        'bg-gradient-to-br from-emerald/30 to-emerald/10'
                      }`}>
                        <TrendingUp size={22} className={
                          vault.type === 'nova' ? 'text-nova' :
                          vault.type === 'orion' ? 'text-orion' :
                          'text-emerald'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">Start Earning</h3>
                        <p className="text-sm text-white/60">Let AI make money for you</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Easy to understand APR section */}
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="text-sm text-white/60 mb-1">Current Profit</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold text-white">{vault.apr}%</div>
                          <div className="text-lg text-white/60">APR</div>
                        </div>
                        <div className="text-xs text-white/60 mt-1">
                          You earn this much annually on your deposit
                        </div>
                      </div>

                      {/* Simplified investment calculator */}
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="text-sm font-medium text-white mb-2">How much can you earn?</div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <div className="text-xs text-white/60">Investment Amount</div>
                              <div className="text-xs font-medium">${projectedAmount}</div>
                            </div>
                            {/* Simplified slider */}
                            <input
                              type="range"
                              min="100"
                              max="10000"
                              step="100"
                              value={Number(projectedAmount)}
                              onChange={(e) => setProjectedAmount(e.target.value)}
                              className={`w-full h-2 rounded-full appearance-none bg-white/20 cursor-pointer ${
                                vault.type === 'nova' ? '[&::-webkit-slider-thumb]:bg-nova' :
                                vault.type === 'orion' ? '[&::-webkit-slider-thumb]:bg-orion' :
                                '[&::-webkit-slider-thumb]:bg-emerald'
                              } [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none`}
                            />
                          </div>

                          {/* Monthly earnings */}
                          <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center">
                            <div className="text-sm text-white">Monthly Income</div>
                            <div className="text-lg font-bold font-mono" style={{ color: colors.primary }}>
                              ${((Number(projectedAmount) * vault.apr / 100) / 12).toFixed(2)}
                            </div>
                          </div>

                          {/* Yearly earnings */}
                          <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center">
                            <div className="text-sm text-white">Annual Income</div>
                            <div className="text-lg font-bold font-mono" style={{ color: colors.primary }}>
                              ${(Number(projectedAmount) * vault.apr / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Big CTA Button */}
                      <button
                        onClick={handleActionClick}
                        className={`relative w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg overflow-hidden group`}
                      >
                        <div className={`absolute inset-0 ${
                          vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                          vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                          'bg-gradient-to-r from-emerald to-green-500'
                        }`}></div>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div className="absolute -inset-1 rounded-xl opacity-30 group-hover:opacity-100 transition-opacity group-hover:animate-pulse" style={{
                          borderWidth: 2,
                          borderColor: vault.type === 'nova' ? '#f97316' : vault.type === 'orion' ? '#f59e0b' : '#10b981'
                        }}></div>
                        <div className="relative flex items-center justify-center gap-2">
                          {isConnected ? "Deposit Now" : "Connect Wallet"}
                          <ArrowUpRight size={20} />
                        </div>
                      </button>

                      {/* Simplified risk indicator */}
                      <div className="flex items-center gap-2 text-white/60 text-xs justify-center">
                        <Shield size={14} className="text-white/60" />
                        <span>Risk: {vault.riskLevel === 'low' ? 'Low' : vault.riskLevel === 'medium' ? 'Medium' : 'High'} · Unlock after {Math.ceil((unlockTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* NODOAIx Token Card - Simplified */}
                <motion.div
                  ref={nodoaixCardRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg"
                >
                  {/* Card content with backdrop blur */}
                  <div className="relative bg-[#060708] backdrop-blur-md p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">AIx</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">NODOAIx Rewards</h3>
                        <p className="text-xs text-white/60">Earn more while your money grows</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Simplified token display */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                        <div className="text-3xl font-bold text-amber-500 mb-1">
                          {Math.floor(Number(projectedAmount) * 0.8)} AIx
                        </div>
                        <div className="text-sm text-white/60">
                          Tokens you will receive when you deposit
                        </div>
                      </div>

                      {/* Benefits list */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="text-sm font-medium text-white mb-2">With these tokens you can:</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-amber-500">•</div>
                            <div className="text-xs text-white/80">Get up to +2.5% additional profit</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-amber-500">•</div>
                            <div className="text-xs text-white/80">Vote for future platform features</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-amber-500">•</div>
                            <div className="text-xs text-white/80">Access premium AI tools</div>
                          </div>
                        </div>
                      </div>

                      {/* Price trend */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex justify-between text-xs">
                          <div className="text-white/60">Current Price</div>
                          <div className="font-medium text-white">$0.043</div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div className="text-white/60">Price Change</div>
                          <div className="text-green-500">+12.3% last month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 lg:order-1 space-y-6 mt-6 lg:mt-0">
              {/* Performance Card */}
              <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                    vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                    'bg-gradient-to-br from-emerald/30 to-emerald/10'
                  }`}>
                    <LineChart size={20} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Performance History</h3>
                    <p className="text-sm text-white/60">
                      How AI is growing your money
                    </p>
                  </div>
                </div>
                <VaultPerformanceSection
                  vault={vault}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  styles={styles}
                />
              </div>

              {/* AI Health Monitor */}
              {showAiInsights && (
                <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                      vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                      'bg-gradient-to-br from-emerald/30 to-emerald/10'
                    }`}>
                      <Brain size={20} className={
                        vault.type === 'nova' ? 'text-nova' :
                        vault.type === 'orion' ? 'text-orion' :
                        'text-emerald'
                      } />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Health Monitor</h3>
                      <p className="text-sm text-white/60">
                        How AI is working for you
                      </p>
                    </div>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className={`bg-black/30 rounded-xl border ${
                    vault.type === 'nova' ? 'border-nova/20' :
                    vault.type === 'orion' ? 'border-orion/20' :
                    'border-emerald/20'
                  } p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={16} className={
                        vault.type === 'nova' ? 'text-nova' :
                        vault.type === 'orion' ? 'text-orion' :
                        'text-emerald'
                      } />
                      <div className="text-sm font-medium text-white">Độ tự tin của AI</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {aiConfidenceScore}%
                      </div>
                      <div className="text-xs text-white/60">
                        AI is very confident in the current strategy
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${aiConfidenceScore}%`,
                          backgroundColor: colors.primary
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={`bg-black/30 rounded-xl border ${
                    vault.type === 'nova' ? 'border-nova/20' :
                    vault.type === 'orion' ? 'border-orion/20' :
                    'border-emerald/20'
                  } p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={16} className={
                        vault.type === 'nova' ? 'text-nova' :
                        vault.type === 'orion' ? 'text-orion' :
                        'text-emerald'
                      } />
                      <div className="text-sm font-medium text-white">Processing Power</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {neuroProcessingScore}%
                      </div>
                      <div className="text-xs text-white/60">
                        Processing capacity being used
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${neuroProcessingScore}%`,
                          backgroundColor: colors.primary
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                    <div className="text-sm font-medium text-white">Recent AI Activity</div>
                  </div>
                  <div className="space-y-2">
                    {optimizationEvents.slice(0, 3).map((event, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: colors.primary }}></div>
                        <div className="text-sm text-white/80">{event}</div>
                        <div className="text-xs text-white/50 ml-auto">{index === 0 ? 'Just now' : index === 1 ? '5m ago' : '15m ago'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* AI Strategy Card - Simplified */}
              {showAiInsights && (
                <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                      vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                      'bg-gradient-to-br from-emerald/30 to-emerald/10'
                    }`}>
                      <Lightbulb size={20} className={
                        vault.type === 'nova' ? 'text-nova' :
                        vault.type === 'orion' ? 'text-orion' :
                        'text-emerald'
                      } />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">How AI Makes Money</h3>
                      <p className="text-sm text-white/60">
                        Simple explanation of AI strategy
                      </p>
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                        <span className="text-xl font-bold" style={{ color: colors.primary }}>1</span>
                      </div>
                      <div className="text-base font-medium text-white">Find Opportunities</div>
                    </div>
                    <p className="text-sm text-white/70">
                      AI continuously scans the market to find the best places to make money from your deposit
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                        <span className="text-xl font-bold" style={{ color: colors.primary }}>2</span>
                      </div>
                      <div className="text-base font-medium text-white">Smart Decisions</div>
                    </div>
                    <p className="text-sm text-white/70">
                      AI decides where to place your money for maximum profit with appropriate risk
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                        <span className="text-xl font-bold" style={{ color: colors.primary }}>3</span>
                      </div>
                      <div className="text-base font-medium text-white">Protect & Grow</div>
                    </div>
                    <p className="text-sm text-white/70">
                      Your money is protected while growing, AI adjusts strategy when necessary
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={16} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                    <div className="text-sm font-medium text-white">
                      This strategy is {vault.riskLevel === 'low' ? 'Safe' : vault.riskLevel === 'medium' ? 'Balanced' : 'Growth'}
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    {vault.type === 'nova' ?
                      'This AI focuses on finding high growth opportunities while still protecting your investment. It moves quickly to capture profits and minimize losses.' :
                      vault.type === 'orion' ?
                      'This AI balances growth and safety. It looks for solid opportunities with good returns while keeping risk at a moderate level.' :
                      'This AI prioritizes safety above all. It chooses the most stable investments that still provide reasonable returns, perfect for cautious investors.'
                    }
                  </p>
                </div>
              </div>
              )}

              {/* AI Transaction Activity - Simplified */}
              {showAiInsights && (
                <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                      vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                      'bg-gradient-to-br from-emerald/30 to-emerald/10'
                    }`}>
                      <BarChart size={20} className={
                        vault.type === 'nova' ? 'text-nova' :
                        vault.type === 'orion' ? 'text-orion' :
                        'text-emerald'
                      } />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Activity Stream</h3>
                      <p className="text-sm text-white/60">
                        See AI working for you in real time
                      </p>
                    </div>
                  </div>
                  <AITransactionTicker vaultType={vault.type} />
                </div>
              )}

              {/* Security Information - Simplified */}
              <Card className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative">
                {/* Card content with backdrop blur */}
                <div className="relative bg-black/50 backdrop-blur-md">
                  <CardHeader className="p-6 pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
                        vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
                        'bg-gradient-to-br from-emerald/30 to-emerald/10'
                      }`}>
                        <Shield size={20} className={
                          vault.type === 'nova' ? 'text-nova' :
                          vault.type === 'orion' ? 'text-orion' :
                          'text-emerald'} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold mb-0.5">Your Money is Protected</CardTitle>
                        <CardDescription className="text-sm text-white/60">
                          How we protect your investment 24/7
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={16} className={
                            vault.type === 'nova' ? 'text-nova' :
                            vault.type === 'orion' ? 'text-orion' :
                            'text-emerald'
                          } />
                          <div className="text-sm font-medium text-white">Audited Code</div>
                        </div>
                        <p className="text-xs text-white/70">
                          Our smart contracts have been audited by leading security companies
                        </p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock size={16} className={
                            vault.type === 'nova' ? 'text-nova' :
                            vault.type === 'orion' ? 'text-orion' :
                            'text-emerald'
                          } />
                          <div className="text-sm font-medium text-white">Risk Control</div>
                        </div>
                        <p className="text-xs text-white/70">
                          AI continuously monitors and adjusts positions to protect your money from market fluctuations
                        </p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu size={16} className={
                            vault.type === 'nova' ? 'text-nova' :
                            vault.type === 'orion' ? 'text-orion' :
                            'text-emerald'
                          } />
                          <div className="text-sm font-medium text-white">24/7 Monitoring</div>
                        </div>
                        <p className="text-xs text-white/70">
                          Unlike humans, our AI never sleeps and continuously monitors your investment
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Shield size={24} className="text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-1">Current Security Status</div>
                        <div className="flex items-center gap-2 text-sm text-green-500">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          All systems operating well
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

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
