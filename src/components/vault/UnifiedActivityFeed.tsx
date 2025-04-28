import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  RefreshCw,
  Sparkles,
  Cpu
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NovaAIReasoningDrawer } from "../ai/NovaAIReasoningDrawer";

interface Activity {
  id: string;
  type: "deposit" | "withdraw" | "ai";
  amount?: number;
  timestamp: Date;
  vault: string;  // This is internal, not shown directly to users
  user?: string;
  aiAction?: string;
  aiResult?: string;
  aiActionType?: 'add_liquidity' | 'remove_liquidity' | 'rebalance' | 'adjust_range';
  range?: [number, number];
  expectedAprChange?: number;
}

interface UnifiedActivityFeedProps {
  className?: string;
}

export function UnifiedActivityFeed({ className = "" }: UnifiedActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isReasoningDrawerOpen, setIsReasoningDrawerOpen] = useState(false);

  // Get transaction history from vault service
  const { data: transactions, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => vaultService.getTransactionHistory(),
    refetchOnWindowFocus: false,
  });

  // Generate simulated activities
  useEffect(() => {
    // Convert transactions to activities format (if any)
    const txActivities = transactions ? transactions.map((tx) => ({
      id: tx.id,
      type: tx.type as "deposit" | "withdraw",
      amount: tx.amount,
      timestamp: new Date(tx.timestamp),
      vault: tx.vaultName,
      user: tx.id.substring(0, 8), // Simulated user address
    })) : [];

    // Generate AI activities - Note: We keep internal pool names but don't expose them directly to users
    const aiActivities: Activity[] = [
      {
        id: "ai-1",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 2), // 2 minutes ago
        vault: "DEEP-SUI", // Internal reference
        aiAction: "Optimized position range",
        aiActionType: "adjust_range",
        range: [0.98, 1.03],
        expectedAprChange: 0.4,
        aiResult: "+0.4% APR",
      },
      {
        id: "ai-2",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 5), // 5 minutes ago
        vault: "CETUS-SUI", // Internal reference
        aiAction: "Rebalanced LP positions",
        aiActionType: "rebalance",
        expectedAprChange: 0.35,
        aiResult: "$240 fees captured",
      },
      {
        id: "ai-3",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 8), // 8 minutes ago
        vault: "SUI-USDC", // Internal reference
        aiAction: "Modified fee tier allocation",
        aiActionType: "adjust_range",
        range: [0.99, 1.01],
        expectedAprChange: 0.2,
        aiResult: "Reduced slippage",
      },
      {
        id: "ai-4",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 15), // 15 minutes ago
        vault: "DEEP-SUI", // Internal reference
        aiAction: "Adjusted impermanent loss parameters",
        aiActionType: "remove_liquidity",
        amount: 3500,
        expectedAprChange: -0.15, // Negative means prevented loss
        aiResult: "Risk -9%",
      },
      {
        id: "ai-5",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 22), // 22 minutes ago
        vault: "SUI-USDC", // Internal reference
        aiAction: "Executed price protection strategy",
        aiActionType: "remove_liquidity",
        amount: 15000,
        expectedAprChange: -0.3,
        aiResult: "Protected $15K assets",
      },
      {
        id: "ai-6",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 37), // 37 minutes ago
        vault: "CETUS-SUI", // Internal reference
        aiAction: "Dynamic fee recalibration",
        aiActionType: "rebalance",
        expectedAprChange: 0.52,
        aiResult: "+5.2% efficiency",
      },
      {
        id: "ai-7",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 48), // 48 minutes ago
        vault: "DEEP-SUI", // Internal reference
        aiAction: "Price volatility analysis",
        aiActionType: "add_liquidity",
        amount: 2000,
        range: [0.95, 1.05],
        expectedAprChange: 0.65,
        aiResult: "Position shift initiated",
      },
      {
        id: "ai-8",
        type: "ai",
        timestamp: new Date(Date.now() - 60000 * 67), // 67 minutes ago
        vault: "SUI-USDC", // Internal reference
        aiAction: "Market sentiment adjustment",
        aiActionType: "add_liquidity",
        amount: 4500,
        expectedAprChange: 0.25,
        aiResult: "Strategy updated",
      },
    ];

    // Combine and sort all activities
    const allActivities = [...txActivities, ...aiActivities].sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    setActivities(allActivities);
  }, [transactions]);

  // Format time ago
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Open reasoning drawer with selected activity
  const openReasoningDrawer = (activity: Activity) => {
    if (activity.type !== 'ai') return;

    // Convert to the format expected by NovaAIReasoningDrawer
    const aiAction = {
      id: activity.id,
      type: activity.aiActionType || 'rebalance',
      pool: activity.vault,
      timestamp: activity.timestamp.toISOString(),
      amount: activity.amount,
      range: activity.range,
      expectedAprChange: activity.expectedAprChange || 0
    };

    setSelectedActivity(activity);
    setIsReasoningDrawerOpen(true);
  };

  // Filter activities by type
  const aiActivities = activities.filter(a => a.type === 'ai');
  const userActivities = activities.filter(a => a.type === 'deposit' || a.type === 'withdraw');

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="ai-activity" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-white/5 rounded-lg p-1">
            <TabsTrigger
              value="ai-activity"
              className="flex items-center gap-2 data-[state=active]:bg-nova/20 data-[state=active]:text-nova"
            >
              <Cpu size={14} />
              <span>AI Activity</span>
              <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px]">
                {aiActivities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="my-transactions"
              className="flex items-center gap-2 data-[state=active]:bg-nova/20 data-[state=active]:text-nova"
            >
              <ArrowUpRight size={14} />
              <span>My Transactions</span>
              <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px]">
                {userActivities.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                refetch();
                // Add a slight delay for visual feedback
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) {
                  btn.classList.add('animate-spin-once');
                  setTimeout(() => btn.classList.remove('animate-spin-once'), 500);
                }
              }}
              className="px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={16} className="text-white/60" />
            </button>
          </div>

          <TabsContent value="ai-activity" className="mt-0">
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence initial={false}>
                {aiActivities.length > 0 ? (
                  aiActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            <div className="h-8 w-8 rounded-full bg-nova/10 flex items-center justify-center">
                              <Brain size={16} className="text-nova" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm font-medium text-white space-x-1">
                              <span>AI optimized</span>
                              {/* Don't show raw pool name to user */}
                              <span className="text-white">Vault</span>
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              <div className="flex items-center">
                                <span>{activity.aiAction}</span>
                                <span className="mx-1.5">•</span>
                                <span className="text-emerald font-medium">{activity.aiResult}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-white/40 font-mono mt-1">
                            {getTimeAgo(activity.timestamp)} ago
                          </div>
                          <button
                            onClick={() => openReasoningDrawer(activity)}
                            className="flex items-center justify-center h-6 w-6 rounded-full bg-nova/10 hover:bg-nova/20 transition-colors group"
                            aria-label="Show reasoning"
                          >
                            <Sparkles size={14} className="text-nova animate-pulse group-hover:animate-none" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40">
                    No AI activities found
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="my-transactions" className="mt-0">
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence initial={false}>
                {userActivities.length > 0 ? (
                  userActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            {activity.type === "deposit" && (
                              <div className="h-8 w-8 rounded-full bg-emerald/10 flex items-center justify-center">
                                <ArrowUpRight size={16} className="text-emerald" />
                              </div>
                            )}
                            {activity.type === "withdraw" && (
                              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                <ArrowDownRight size={16} className="text-red-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center text-sm font-medium text-white space-x-1">
                              {activity.type === "deposit" && <span>Deposit to</span>}
                              {activity.type === "withdraw" && <span>Withdraw from</span>}
                              {/* Don't show raw pool names to user */}
                              <span className="text-white">Vault</span>
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              <div className="flex items-center">
                                <span className="font-mono font-medium text-white/80">
                                  {formatCurrency(activity.amount || 0)}
                                </span>
                                <span className="mx-1.5">•</span>
                                <span className="font-mono">0x...{activity.user}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-1">
                          {getTimeAgo(activity.timestamp)} ago
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40">
                    No transactions found
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reasoning Drawer */}
      {selectedActivity && (
        <NovaAIReasoningDrawer
          open={isReasoningDrawerOpen}
          onClose={() => setIsReasoningDrawerOpen(false)}
          action={{
            id: selectedActivity.id,
            type: selectedActivity.aiActionType || 'rebalance',
            pool: selectedActivity.vault,
            timestamp: selectedActivity.timestamp.toISOString(),
            amount: selectedActivity.amount,
            range: selectedActivity.range,
            expectedAprChange: selectedActivity.expectedAprChange || 0
          }}
        />
      )}
    </div>
  );
}
