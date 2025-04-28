import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Shield,
  RefreshCw,
  ChevronRight,
  BarChart2,
  Info
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { TransactionHistory } from "@/types/vault";
import { TxDrawer } from "@/components/dashboard/TxDrawer";

interface AIActivity {
  id: string;
  type: 'optimize' | 'analyze' | 'rebalance' | 'protect' | 'monitor';
  vault: string;
  vaultType: 'nova' | 'orion' | 'emerald';
  action: string;
  result: string;
  timestamp: Date;
  aprChange?: number;
  riskChange?: number;
}

interface UserActivity {
  id: string;
  type: 'deposit' | 'withdraw';
  vault: string;
  vaultType: 'nova' | 'orion' | 'emerald';
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export function EnhancedActivitySection() {
  const [selectedTab, setSelectedTab] = useState("ai");
  const [selectedActivity, setSelectedActivity] = useState<AIActivity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [aiActivities] = useState<AIActivity[]>(generateMockAIActivities());
  const [userActivities] = useState<UserActivity[]>(generateMockUserActivities());
  const detailsRef = useRef<HTMLDivElement>(null);

  // Transaction drawer state
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);

  // Close details panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setIsDetailOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function generateMockAIActivities(): AIActivity[] {
    const activities: AIActivity[] = [
      {
        id: "ai-1",
        type: 'optimize',
        vault: "DEEP-SUI",
        vaultType: 'nova',
        action: "Optimized liquidity position ranges",
        result: "Improved fee capture by 0.37%",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        aprChange: 0.37
      },
      {
        id: "ai-2",
        type: 'analyze',
        vault: "CETUS-SUI",
        vaultType: 'orion',
        action: "Analyzed price volatility patterns",
        result: "Adjusted concentration boundaries",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        aprChange: 0.28
      },
      {
        id: "ai-3",
        type: 'rebalance',
        vault: "DEEP-SUI",
        vaultType: 'nova',
        action: "Rebalanced token exposure ratios",
        result: "Reduced impermanent loss by 0.52%",
        timestamp: new Date(Date.now() - 240 * 60 * 1000),
        aprChange: 0.42
      },
      {
        id: "ai-4",
        type: 'protect',
        vault: "SUI-USDC",
        vaultType: 'emerald',
        action: "Implemented volatility safeguards",
        result: "Protected against -2.1% drawdown",
        timestamp: new Date(Date.now() - 380 * 60 * 1000),
        riskChange: -0.31
      },
      {
        id: "ai-5",
        type: 'monitor',
        vault: "CETUS-SUI",
        vaultType: 'orion',
        action: "Monitored on-chain price movements",
        result: "Enhanced prediction accuracy",
        timestamp: new Date(Date.now() - 480 * 60 * 1000),
        aprChange: 0.18
      },
      {
        id: "ai-6",
        type: 'optimize',
        vault: "SUI-USDC",
        vaultType: 'emerald',
        action: "Calibrated fee tier allocations",
        result: "Maximized stable yield",
        timestamp: new Date(Date.now() - 590 * 60 * 1000),
        aprChange: 0.22
      },
    ];

    return activities;
  }

  function generateMockUserActivities(): UserActivity[] {
    const activities: UserActivity[] = [
      {
        id: "user-1",
        type: 'deposit',
        vault: "DEEP-SUI",
        vaultType: 'nova',
        amount: 5000,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: "user-2",
        type: 'deposit',
        vault: "CETUS-SUI",
        vaultType: 'orion',
        amount: 2500,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: "user-3",
        type: 'withdraw',
        vault: "SUI-USDC",
        vaultType: 'emerald',
        amount: 1200,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: "user-4",
        type: 'deposit',
        vault: "SUI-USDC",
        vaultType: 'emerald',
        amount: 3000,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        status: 'completed'
      }
    ];

    return activities;
  }

  // Convert UserActivity to TransactionHistory format for TxDrawer compatibility
  function convertToTransactionHistory(activity: UserActivity): TransactionHistory {
    return {
      id: activity.id,
      type: activity.type,
      amount: activity.amount,
      vaultId: activity.vault.toLowerCase().replace('-', '-'),
      vaultName: activity.vault,
      timestamp: activity.timestamp.toISOString(),
      status: activity.status
    };
  }

  function getTimeAgo(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  function getTypeIcon(type: string, vaultType: string) {
    const color = vaultType === 'nova' ? 'text-nova' : vaultType === 'orion' ? 'text-orion' : 'text-emerald';

    switch (type) {
      case 'optimize':
        return <TrendingUp size={16} className={color} />;
      case 'analyze':
        return <BarChart2 size={16} className={color} />;
      case 'rebalance':
        return <RefreshCw size={16} className={color} />;
      case 'protect':
        return <Shield size={16} className={color} />;
      case 'monitor':
        return <Info size={16} className={color} />;
      case 'deposit':
        return <ArrowDownRight size={16} className="text-emerald" />;
      case 'withdraw':
        return <ArrowUpRight size={16} className="text-amber-500" />;
      default:
        return <Sparkles size={16} className={color} />;
    }
  }

  function getActionClass(vaultType: string) {
    switch (vaultType) {
      case 'nova':
        return 'border-nova/20 text-nova';
      case 'orion':
        return 'border-orion/20 text-orion';
      case 'emerald':
        return 'border-emerald/20 text-emerald';
      default:
        return 'border-white/20 text-white/80';
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            Failed
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="relative">
      <Card className="bg-black/30 border-white/10 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-nova/20 via-nova/10 to-transparent">
                <Clock size={18} className="text-nova" />
              </div>
              <span>Live Activity</span>
            </CardTitle>
            <div className="text-xs text-white/50">
              Real-time vault updates from AI and users
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <Tabs defaultValue="ai" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-2 mb-4 bg-white/5 p-0.5 rounded-lg border border-white/10">
              <TabsTrigger
                value="ai"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-nova/20 data-[state=active]:to-nova/5 data-[state=active]:shadow-none rounded-md py-1.5"
              >
                <Brain size={14} className="text-nova" />
                <span className="text-sm">AI Activity</span>
              </TabsTrigger>
              <TabsTrigger
                value="user"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald/20 data-[state=active]:to-emerald/5 data-[state=active]:shadow-none rounded-md py-1.5"
              >
                <Zap size={14} className="text-emerald" />
                <span className="text-sm">User Transactions</span>
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="ai" className="m-0 space-y-2">
                    {aiActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className={`p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${isDetailOpen && selectedActivity?.id === activity.id ? 'bg-white/10 border-white/20' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsDetailOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br from-${activity.vaultType === 'nova' ? 'nova' : activity.vaultType === 'orion' ? 'amber-500' : 'emerald'}/20 to-transparent flex-shrink-0 mt-0.5`}>
                              {getTypeIcon(activity.type, activity.vaultType)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getActionClass(activity.vaultType)}`}>
                                  {activity.vault}
                                </span>
                                <span className="text-white/50 text-xs">
                                  {getTimeAgo(activity.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-white/90 mb-1">{activity.action}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-emerald">
                                  {activity.result}
                                </span>
                                {activity.aprChange && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald/10 text-emerald/90 flex items-center gap-1">
                                    <TrendingUp size={10} />
                                    +{activity.aprChange.toFixed(2)}%
                                  </span>
                                )}
                                {activity.riskChange && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500/90 flex items-center gap-1">
                                    <Shield size={10} />
                                    {activity.riskChange.toFixed(2)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-white/30 mt-2" />
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="user" className="m-0 space-y-2">
                    {userActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => {
                          const tx = convertToTransactionHistory(activity);
                          setSelectedTx(tx);
                          setIsTxDrawerOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.type === 'deposit' ? 'from-emerald/20 to-transparent' : 'from-amber-500/20 to-transparent'} flex-shrink-0 mt-0.5`}>
                              {getTypeIcon(activity.type, activity.vaultType)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getActionClass(activity.vaultType)}`}>
                                  {activity.vault}
                                </span>
                                <span className="text-white/50 text-xs">
                                  {getTimeAgo(activity.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-white/90 mb-1">
                                {activity.type === 'deposit' ? 'Deposited into vault' : 'Withdrew from vault'}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-white/90">
                                  ${activity.amount.toLocaleString()}
                                </span>
                                {getStatusBadge(activity.status)}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-white/30 mt-2" />
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </motion.div>
              </AnimatePresence>

              {/* AI Activity Details Panel */}
              <AnimatePresence>
                {isDetailOpen && selectedActivity && (
                  <motion.div
                    ref={detailsRef}
                    className="absolute top-0 right-0 w-full h-full bg-black/80 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-br from-${selectedActivity.vaultType === 'nova' ? 'nova' : selectedActivity.vaultType === 'orion' ? 'amber-500' : 'emerald'}/30 to-transparent`}>
                            <Brain size={20} className={
                              selectedActivity.vaultType === 'nova'
                                ? 'text-nova'
                                : selectedActivity.vaultType === 'orion'
                                  ? 'text-orion'
                                  : 'text-emerald'
                            } />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">AI Activity Details</h3>
                            <div className="text-xs text-white/60">Advanced neural network actions</div>
                          </div>
                        </div>
                        <button
                          className="p-1 rounded-full hover:bg-white/10 transition-colors"
                          onClick={() => setIsDetailOpen(false)}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getActionClass(selectedActivity.vaultType)}`}>
                            {selectedActivity.vault}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70">
                            {getTimeAgo(selectedActivity.timestamp)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 capitalize">
                            {selectedActivity.type} Action
                          </span>
                        </div>

                        <h4 className="text-xl font-medium mb-2">{selectedActivity.action}</h4>
                        <p className="text-sm text-white/70 mb-4">
                          The neural network performed a sophisticated {selectedActivity.type} operation on the {selectedActivity.vault} vault,
                          analyzing real-time market conditions and on-chain data to optimize performance.
                        </p>

                        <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-4">
                          <div className="text-sm font-medium mb-2">Results</div>
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className={
                              selectedActivity.vaultType === 'nova'
                                ? 'text-nova'
                                : selectedActivity.vaultType === 'orion'
                                  ? 'text-orion'
                                  : 'text-emerald'
                            } />
                            <span className="text-white/90">{selectedActivity.result}</span>
                          </div>
                          {selectedActivity.aprChange && (
                            <div className="flex items-center gap-2">
                              <TrendingUp size={16} className="text-emerald" />
                              <span className="text-emerald">APR increase: +{selectedActivity.aprChange.toFixed(2)}%</span>
                            </div>
                          )}
                          {selectedActivity.riskChange && (
                            <div className="flex items-center gap-2">
                              <Shield size={16} className="text-amber-500" />
                              <span className="text-amber-500">Risk reduction: {selectedActivity.riskChange.toFixed(2)}%</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                          <div className="text-sm font-medium mb-2">Neural Action Analysis</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-white/60 mb-1">Confidence Score</div>
                              <div className="text-lg font-mono">
                                {(0.85 + Math.random() * 0.10).toFixed(4)}
                              </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-white/60 mb-1">Model Iterations</div>
                              <div className="text-lg font-mono">
                                {Math.floor(80 + Math.random() * 120)}
                              </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-white/60 mb-1">Data Points</div>
                              <div className="text-lg font-mono">
                                {Math.floor(2500 + Math.random() * 5000).toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-white/60 mb-1">Execution Time</div>
                              <div className="text-lg font-mono">
                                {(0.1 + Math.random() * 0.9).toFixed(2)}s
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Neural activity visualization */}
      <div className="absolute -bottom-6 left-0 right-0 h-12 flex justify-center items-center overflow-hidden pointer-events-none">
        <motion.div
          className="relative h-0.5 w-full max-w-3xl bg-gradient-to-r from-transparent via-nova/70 to-transparent opacity-70"
          animate={{
            scaleX: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Transaction Details Drawer */}
      <TxDrawer
        tx={selectedTx}
        open={isTxDrawerOpen}
        onClose={() => setIsTxDrawerOpen(false)}
      />
    </div>
  );
}
