import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    "Identified arbitrage opportunity between SUI/USDC pairs",
    "Rebalanced positions to maximize yield",
    "Adjusted liquidity allocations based on market trend analysis"
  ]);
  const [showAiConfidenceDetails, setShowAiConfidenceDetails] = useState(false);
  const [showNeuroProcessingDetails, setShowNeuroProcessingDetails] = useState(false);

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
      "Optimized gas usage for higher net returns",
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

        {/* AI Status Indicators - NEW COMPONENT */}
        {showAiInsights && (
          <motion.div
            className="px-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AI Confidence Score Card */}
              <div
                className={`w-full rounded-xl bg-black/40 backdrop-blur-sm border ${
                  vault.type === 'nova' ? 'border-nova/20' :
                  vault.type === 'orion' ? 'border-orion/20' :
                  'border-emerald/20'
                } p-4 relative overflow-hidden cursor-pointer group`}
                onClick={() => setShowAiConfidenceDetails(!showAiConfidenceDetails)}
              >
              <div className="flex items-center gap-3 mb-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    vault.type === 'nova' ? 'bg-nova/10' :
                    vault.type === 'orion' ? 'bg-orion/10' :
                    'bg-emerald/10'
                  }`}>
                    <Brain size={16} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                  </div>
                  <div className="text-sm font-medium text-white">
                    AI Confidence Score
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xl font-mono font-bold ${
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  }`}>{aiConfidenceScore}</span>
                  <ChevronDown
                    size={16}
                    className="ml-1 text-white/50 transition-transform group-hover:text-white/80"
                    style={{ transform: showAiConfidenceDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </div>

              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                    vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                    'bg-gradient-to-r from-emerald to-green-500'
                  }`}
                  style={{ width: `${aiConfidenceScore}%` }}
                ></div>
              </div>

              {/* Explanation details */}
              <AnimatePresence>
                {showAiConfidenceDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-xs text-white/70 space-y-2">
                      <p>Our AI's confidence in its current strategy based on:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Market Analysis</span>
                            <span className="text-xs font-mono">{Math.round(aiConfidenceScore * 0.9)}%</span>
                          </div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Historical Data</span>
                            <span className="text-xs font-mono">{Math.round(aiConfidenceScore * 1.05)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Neural Processing Card */}
            <div
              className={`w-full rounded-xl bg-black/40 backdrop-blur-sm border ${
                vault.type === 'nova' ? 'border-nova/20' :
                vault.type === 'orion' ? 'border-orion/20' :
                'border-emerald/20'
              } p-4 relative overflow-hidden cursor-pointer group`}
              onClick={() => setShowNeuroProcessingDetails(!showNeuroProcessingDetails)}
            >
              <div className="flex items-center gap-3 mb-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    vault.type === 'nova' ? 'bg-nova/10' :
                    vault.type === 'orion' ? 'bg-orion/10' :
                    'bg-emerald/10'
                  }`}>
                    <Cpu size={16} className={
                      vault.type === 'nova' ? 'text-nova' :
                      vault.type === 'orion' ? 'text-orion' :
                      'text-emerald'
                    } />
                  </div>
                  <div className="text-sm font-medium text-white">
                    Neuro Processing
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xl font-mono font-bold ${
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  }`}>{neuroProcessingScore}</span>
                  <ChevronDown
                    size={16}
                    className="ml-1 text-white/50 transition-transform group-hover:text-white/80"
                    style={{ transform: showNeuroProcessingDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </div>

              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                    vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                    'bg-gradient-to-r from-emerald to-green-500'
                  }`}
                  style={{ width: `${neuroProcessingScore}%` }}
                ></div>
              </div>

              {/* Explanation details */}
              <AnimatePresence>
                {showNeuroProcessingDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-xs text-white/70 space-y-2">
                      <p>Neural network computing power current capacity:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Prediction Models</span>
                            <span className="font-mono">{vault.type === 'nova' ? '24' : vault.type === 'orion' ? '18' : '12'}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Processing Units</span>
                            <span className="font-mono">{vault.type === 'nova' ? '128' : vault.type === 'orion' ? '96' : '64'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent AI Activity */}
            <div className={`w-full rounded-xl bg-black/40 backdrop-blur-sm border ${
              vault.type === 'nova' ? 'border-nova/20' :
              vault.type === 'orion' ? 'border-orion/20' :
              'border-emerald/20'
            } p-4 relative overflow-hidden`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${
                  vault.type === 'nova' ? 'bg-nova/10' :
                  vault.type === 'orion' ? 'bg-orion/10' :
                  'bg-emerald/10'
                }`}>
                  <Zap size={16} className={
                    vault.type === 'nova' ? 'text-nova' :
                    vault.type === 'orion' ? 'text-orion' :
                    'text-emerald'
                  } />
                </div>
                <div className="text-sm font-medium text-white">
                  Recent AI Actions
                </div>
              </div>

              <div className="space-y-2 max-h-[60px] overflow-y-auto custom-scrollbar">
                {optimizationEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-center text-xs text-white/70 gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span className="truncate">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Neural Activity Ticker Bar */}
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
                <TranslatedSection>
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
                      <h3 className="text-xl font-bold text-white">
                        <TranslatedText id="lichSuHieuSuat">Lịch sử hiệu suất</TranslatedText>
                      </h3>
                      <p className="text-sm text-white/60">
                        AI-enhanced performance tracking with predictive analysis
                      </p>
                    </div>
                  </div>
                </TranslatedSection>
                <VaultPerformanceSection
                  vault={vault}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  styles={styles}
                />
              </div>

              {/* AI Control Panel */}
              {showAiInsights && <AIControlPanel vaultType={vault.type} vaultName={vault.name} />}

              {/* AI Strategy Card */}
              {showAiInsights && (
                <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                  <TranslatedSection>
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
                        <h3 className="text-xl font-bold text-white">
                          <TranslatedText id="cachAIKiemTien">Cách AI kiếm tiền</TranslatedText>
                        </h3>
                        <p className="text-sm text-white/60">
                          <TranslatedText id="quaTongHopKetQua">Qua tổng hợp kết quả trong ngày</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </TranslatedSection>
                  <AIStrategyVisualizer vaultType={vault.type} />
                </div>
              )}

              {/* AI Transaction Monitoring */}
              {showAiInsights && (
                <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708] p-6">
                  <TranslatedSection>
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
                        <h3 className="text-xl font-bold text-white">
                          <TranslatedText id="luongHoatDongAI">Luồng hoạt động AI</TranslatedText>
                        </h3>
                        <p className="text-sm text-white/60">
                          <TranslatedText>Real-time activity tracking with AI optimization</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </TranslatedSection>
                  <AITransactionTicker vaultType={vault.type} />
                </div>
              )}

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
                        <Shield size={20} className={
                          vault.type === 'nova' ? 'text-nova' :
                          vault.type === 'orion' ? 'text-orion' :
                          'text-emerald'} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold mb-0.5">Security & Risk Management</CardTitle>
                        <CardDescription className="text-sm text-white/60">
                          AI-powered protection and risk mitigation systems
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
                          Risk Strategy
                        </TabsTrigger>
                        <TabsTrigger
                          value="security"
                          className={`data-[state=active]:${
                            vault.type === 'nova' ? 'bg-nova/20 data-[state=active]:text-nova' :
                            vault.type === 'orion' ? 'bg-orion/20 data-[state=active]:text-orion' :
                            'bg-emerald/20 data-[state=active]:text-emerald'
                          }`}
                        >
                          Technical Security
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
                            AI Risk Management
                          </h3>
                          <p className="text-text-secondary text-sm leading-relaxed">
                            Our neural network continuously analyzes market conditions, transaction patterns, and security threats to protect your funds and optimize returns.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <div className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                                <Shield size={12} className={
                                  vault.type === 'nova' ? 'text-nova' :
                                  vault.type === 'orion' ? 'text-orion' :
                                  'text-emerald'
                                } />
                                Protection Systems
                              </div>
                              <div className="text-base font-mono font-medium">
                                {vault.type === 'nova' ? '12' : vault.type === 'orion' ? '10' : '8'} Active Protections
                              </div>
                              <div className="mt-1 text-[10px] text-white/50">
                                Monitors for vulnerabilities & threats
                              </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                              <div className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                                <Clock size={12} className={
                                  vault.type === 'nova' ? 'text-nova' :
                                  vault.type === 'orion' ? 'text-orion' :
                                  'text-emerald'
                                } />
                                Monitoring Status
                              </div>
                              <div className="text-base font-mono font-medium flex items-center gap-2">
                                24/7 Active
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              </div>
                              <div className="mt-1 text-[10px] text-white/50">
                                Continuous real-time analysis
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
                            Risk Profile
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

                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="bg-white/5 p-3 rounded-lg">
                              <div className="text-xs text-white/60 mb-1">Volatility</div>
                              <div className="text-base font-medium flex items-center">
                                <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className={`absolute inset-y-0 left-0 ${
                                    vault.riskLevel === 'low' ? 'bg-emerald w-1/4' :
                                    vault.riskLevel === 'medium' ? 'bg-orion w-2/4' :
                                    'bg-nova w-3/4'
                                  }`}></div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                              <div className="text-xs text-white/60 mb-1">Exposure</div>
                              <div className="text-base font-medium flex items-center">
                                <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className={`absolute inset-y-0 left-0 ${
                                    vault.riskLevel === 'low' ? 'bg-emerald w-1/5' :
                                    vault.riskLevel === 'medium' ? 'bg-orion w-2/5' :
                                    'bg-nova w-4/5'
                                  }`}></div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                              <div className="text-xs text-white/60 mb-1">Liquidity</div>
                              <div className="text-base font-medium flex items-center">
                                <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className={`absolute inset-y-0 left-0 ${
                                    vault.riskLevel === 'low' ? 'bg-emerald w-4/5' :
                                    vault.riskLevel === 'medium' ? 'bg-orion w-3/5' :
                                    'bg-nova w-2/5'
                                  }`}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/20 p-3 rounded-lg border border-white/5 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={14} className={
                                vault.type === 'nova' ? 'text-nova' :
                                vault.type === 'orion' ? 'text-orion' :
                                'text-emerald'
                              } />
                              <span className="text-sm font-medium text-white">AI Risk Mitigation</span>
                            </div>
                            <p className="text-xs text-white/70">
                              {vault.type === 'nova' ?
                                'Our system monitors market conditions continuously and responds quickly to protect your investment during market volatility. High-risk strategies are balanced with advanced loss prevention algorithms.' :
                                vault.type === 'orion' ?
                                'This vault adapts investment strategies based on market conditions, balancing growth potential with appropriate risk management. The AI automatically adjusts capital allocation to maintain optimal risk/reward ratio.' :
                                'This conservative vault prioritizes capital preservation first, automatically adjusting positions to minimize risk during uncertain markets. The AI maintains diversified positions to reduce exposure to any single asset.'
                              }
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="security" className="mt-0">
                        <TranslatedSection>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={16} className={colors.primary} />
                              <h3 className="text-base font-medium text-white">
                                <TranslatedText id="tienCuaBanDuocBaoVe">Tiền của bạn được bảo vệ</TranslatedText>
                              </h3>
                            </div>
                            <p className="text-sm text-white/70">
                              <TranslatedText id="cungCongNghamVaToanHoc">Cùng công nghệ mã và toán học để bảo vệ 24/7</TranslatedText>
                            </p>
                            <VaultSecurityInfo
                              contractAddress="0x1234567890abcdef1234567890abcdef12345678"
                              isAudited={true}
                              explorerUrl="https://explorer.sui.io/address/0x1234567890abcdef1234567890abcdef12345678"
                              defaultOpen={true}
                            />
                          </div>
                        </TranslatedSection>
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
                            <span>NODOAIx Tokens</span>
                          </CardTitle>
                          <CardDescription className="text-sm text-white/60">
                            Rewards for vault participation
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
                              <h4 className="font-medium text-sm mb-2 text-amber-500">About NODOAIx Tokens</h4>
                              <p className="text-sm text-white/80">
                                NODOAIx tokens are earned by depositing into vaults. They can be used for boosting yields, governance voting, and accessing exclusive features. Your tokens increase in value as the platform grows.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-5">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
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
                              Current token balance
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Token benefits */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                          <Sparkles size={14} className="text-amber-500" />
                          Token Benefits
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-white/80">
                            <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                            <span>Yield Boosts up to +2.5% APR</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/80">
                            <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                            <span>Voting Rights in Protocol Governance</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/80">
                            <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                            <span>Premium AI Features Access</span>
                          </div>
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

                      {/* Call to action */}
                      <Button
                        className={`w-full h-10 text-white transition-all hover:scale-[0.98] shadow-lg text-sm font-semibold ${
                          'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400'
                        }`}
                        onClick={handleActionClick}
                      >
                        Deposit to Earn More AIx
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Total Token Holders</span>
                          <span className="font-mono">4,621</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Token Price</span>
                          <span className="font-mono text-white/80 flex items-center">
                            $0.043 <span className="text-green-500 ml-1">+2.3%</span>
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
