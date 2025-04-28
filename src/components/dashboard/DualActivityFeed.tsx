import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sparkle, AreaChart, Clock, Activity, Tag, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { NovaAIReasoningDrawer } from "@/components/ai/NovaAIReasoningDrawer";
import { formatDistanceToNow } from "date-fns";
import { TransactionHistory } from "@/types/vault";

// AI Activity interfaces
interface AIAction {
  id: string;
  type: 'add_liquidity' | 'remove_liquidity' | 'rebalance' | 'adjust_range';
  pool: string;
  timestamp: string;
  amount?: number;
  range?: [number, number];
  expectedAprChange: number;
}

interface DualActivityFeedProps {
  className?: string;
  transactions: TransactionHistory[];
}

const mockAIActivity: AIAction[] = [
  {
    id: 'action1',
    type: 'add_liquidity',
    pool: 'deep-sui',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    amount: 2000,
    range: [0.98, 1.03],
    expectedAprChange: 0.8
  },
  {
    id: 'action2',
    type: 'adjust_range',
    pool: 'cetus-sui',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    range: [0.97, 1.04],
    expectedAprChange: 0.5
  },
  {
    id: 'action3',
    type: 'rebalance',
    pool: 'deep-sui',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    amount: 1500,
    expectedAprChange: 1.2
  },
  {
    id: 'action4',
    type: 'remove_liquidity',
    pool: 'sui-usdc',
    timestamp: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    amount: 3000,
    expectedAprChange: -0.3
  }
];

export function DualActivityFeed({ className = "", transactions }: DualActivityFeedProps) {
  const [selectedTab, setSelectedTab] = useState("ai-activity");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);

  const handleExplainClick = (action: AIAction) => {
    setSelectedAction(action);
    setDrawerOpen(true);
  };

  const formatTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const renderAIActionType = (type: string) => {
    switch (type) {
      case 'add_liquidity':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Added Liquidity
          </Badge>
        );
      case 'remove_liquidity':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Removed Liquidity
          </Badge>
        );
      case 'rebalance':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Rebalanced
          </Badge>
        );
      case 'adjust_range':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Adjusted Range
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Unknown
          </Badge>
        );
    }
  };

  const renderTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Deposit
          </Badge>
        );
      case 'withdraw':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Withdraw
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Unknown
          </Badge>
        );
    }
  };

  const renderTransactionStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Unknown
          </Badge>
        );
    }
  };

  const formatPoolName = (pool: string) => {
    if (!pool) return '';
    return pool.replace('-', '–').toUpperCase();
  };

  return (
    <>
      <Card className={`glass-card rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] ${className}`}>
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-lg font-medium text-[#E5E7EB] flex items-center">
            <Activity className="mr-2 h-5 w-5 text-white/60" />
            Activity Feed
          </CardTitle>
          <CardDescription className="text-sm text-[#9CA3AF]">
            AI actions and your transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="ai-activity" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-2 bg-white/5 rounded-lg p-1 mb-4">
                <TabsTrigger
                  value="ai-activity"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500"
                >
                  <Sparkle className="mr-2 h-4 w-4" />
                  AI Activity
                </TabsTrigger>
                <TabsTrigger
                  value="my-transactions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  My Transactions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ai-activity" className="mt-0">
              <div className="bg-white/[0.02] border-y border-white/[0.06] px-6 py-2">
                <div className="grid grid-cols-12 text-xs font-medium text-white/60">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Pool</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">APR Impact</div>
                  <div className="col-span-2">Time</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {mockAIActivity.map((action) => (
                  <div key={action.id} className="px-6 py-4 grid grid-cols-12 items-center text-sm">
                    <div className="col-span-3">
                      {renderAIActionType(action.type)}
                    </div>
                    <div className="col-span-2 font-mono text-white/80">
                      {formatPoolName(action.pool)}
                    </div>
                    <div className="col-span-2">
                      {action.amount ? `${action.amount.toLocaleString()} USDC` : '—'}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className={`font-mono ${action.expectedAprChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {action.expectedAprChange > 0 ? '+' : ''}{action.expectedAprChange.toFixed(2)}%
                      </span>
                      <AreaChart className="ml-1 h-4 w-4 text-white/40" />
                    </div>
                    <div className="col-span-2 flex items-center text-white/60">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{formatTimeAgo(action.timestamp)}</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleExplainClick(action)}
                        className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors animate-pulse"
                      >
                        <Sparkle className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-transactions" className="mt-0">
              <div className="bg-white/[0.02] border-y border-white/[0.06] px-6 py-2">
                <div className="grid grid-cols-12 text-xs font-medium text-white/60">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-3">Vault</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Time</div>
                </div>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="px-6 py-4 grid grid-cols-12 items-center text-sm">
                      <div className="col-span-3 flex items-center">
                        {renderTransactionType(tx.type)}
                        {tx.type === 'deposit' ? (
                          <ArrowDownToLine className="ml-2 h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowUpFromLine className="ml-2 h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="col-span-3 font-medium text-white/80">
                        {tx.vaultName}
                      </div>
                      <div className="col-span-2 font-mono">
                        {tx.amount.toLocaleString()} USDC
                      </div>
                      <div className="col-span-2">
                        {renderTransactionStatus(tx.status)}
                      </div>
                      <div className="col-span-2 flex items-center text-white/60">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{formatTimeAgo(tx.timestamp)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-white/60">
                    <p>No transactions yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <NovaAIReasoningDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        action={selectedAction}
      />
    </>
  );
}
