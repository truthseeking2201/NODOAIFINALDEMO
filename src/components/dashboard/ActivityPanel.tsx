import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, ArrowUpRight, ArrowDownRight, Clock, RefreshCw, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TransactionHistory } from "@/types/vault";
import { Badge } from "@/components/ui/badge";
import { NovaAIReasoningDrawer } from "@/components/ai/NovaAIReasoningDrawer";

// AI Activity interfaces
interface AIAction {
  id: string;
  type: 'add_liquidity' | 'remove_liquidity' | 'rebalance' | 'adjust_range';
  pool: string;
  timestamp: string;
  amount?: number;
  range?: [number, number];
  expectedAprChange: number;
  aiActionType?: string;
  aiAction?: string;
  aiResult?: string;
  vault?: string;
}

interface ActivityPanelProps {
  activities: TransactionHistory[];
  isLoading: boolean;
}

// Mock AI activities (in a real app, this would come from an API)
const mockAIActivities: AIAction[] = [
  {
    id: 'action1',
    type: 'add_liquidity',
    pool: 'deep-sui',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    amount: 2000,
    range: [0.98, 1.03],
    expectedAprChange: 0.8,
    aiAction: 'Added liquidity to optimal range',
    aiResult: '+0.8% APR increase',
    vault: 'DEEP-SUI'
  },
  {
    id: 'action2',
    type: 'adjust_range',
    pool: 'cetus-sui',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    range: [0.97, 1.04],
    expectedAprChange: 0.5,
    aiAction: 'Adjusted liquidity range for efficiency',
    aiResult: '+0.5% APR increase',
    vault: 'CETUS-SUI'
  },
  {
    id: 'action3',
    type: 'rebalance',
    pool: 'deep-sui',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    amount: 1500,
    expectedAprChange: 1.2,
    aiAction: 'Rebalanced position to optimize yield',
    aiResult: '+1.2% APR increase',
    vault: 'DEEP-SUI'
  },
  {
    id: 'action4',
    type: 'remove_liquidity',
    pool: 'sui-usdc',
    timestamp: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    amount: 3000,
    expectedAprChange: -0.3,
    aiAction: 'Removed liquidity from underperforming range',
    aiResult: 'Prevented further losses',
    vault: 'SUI-USDC'
  }
];

export function ActivityPanel({ activities, isLoading }: ActivityPanelProps) {
  const [selectedActivity, setSelectedActivity] = useState<AIAction | null>(null);
  const [isReasoningDrawerOpen, setIsReasoningDrawerOpen] = useState(false);

  if (isLoading) {
    return <ActivitySkeletonLoader />;
  }

  // Filter AI activities vs user transactions
  const aiActivities = mockAIActivities;
  const userTransactions = activities;

  const openReasoningDrawer = (activity: AIAction) => {
    setSelectedActivity(activity);
    setIsReasoningDrawerOpen(true);
  };

  if (!activities.length && !mockAIActivities.length) {
    return <EmptyActivityState />;
  }

  return (
    <>
      <Card className="activity-panel border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai-activity" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-white/5 p-1 rounded-lg">
              <TabsTrigger value="ai-activity" className="tab-trigger data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500">
                <Brain size={14} className="mr-1" />
                AI Activity
              </TabsTrigger>
              <TabsTrigger value="my-transactions" className="tab-trigger data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500">
                <ArrowUpRight size={14} className="mr-1" />
                My Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-activity" className="tab-content">
              <div className="activity-list space-y-2">
                {aiActivities.length > 0 ? (
                  aiActivities.map(activity => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      onExplain={() => openReasoningDrawer(activity)}
                    />
                  ))
                ) : (
                  <EmptyTabContent
                    message="No AI activities yet. As you invest, our AI will optimize your positions."
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="my-transactions" className="tab-content">
              <div className="activity-list space-y-2">
                {userTransactions.length > 0 ? (
                  userTransactions.map(transaction => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <EmptyTabContent
                    message="No transactions yet. Make your first deposit to get started."
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedActivity && (
        <NovaAIReasoningDrawer
          open={isReasoningDrawerOpen}
          onClose={() => setIsReasoningDrawerOpen(false)}
          action={{
            id: selectedActivity.id,
            type: selectedActivity.type as any,
            pool: selectedActivity.pool,
            timestamp: selectedActivity.timestamp,
            amount: selectedActivity.amount,
            range: selectedActivity.range,
            expectedAprChange: selectedActivity.expectedAprChange
          }}
        />
      )}
    </>
  );
}

function ActivityItem({ activity, onExplain }: { activity: AIAction, onExplain: () => void }) {
  return (
    <div className="activity-item flex items-start p-3 bg-black/40 border border-white/10 rounded-lg hover:bg-black/50 transition-colors">
      <div className="activity-icon mr-3 p-2 rounded-full bg-nova/10 text-nova">
        <Brain size={16} />
      </div>
      <div className="activity-content flex-1 min-w-0">
        <div className="activity-header flex justify-between items-start mb-1">
          <span className="activity-title text-sm font-medium">AI optimized {activity.vault} Vault</span>
          <span className="activity-time text-xs text-white/60">{formatTimeAgo(activity.timestamp)}</span>
        </div>
        <div className="activity-details">
          <span className="text-xs text-white/80 block">{activity.aiAction}</span>
          <span className="activity-result text-xs text-emerald block">{activity.aiResult}</span>
        </div>
      </div>
      <button
        onClick={onExplain}
        className="explain-button p-2 rounded-full bg-nova/10 text-nova hover:bg-nova/20 transition-colors ml-2"
        aria-label="Show AI reasoning"
      >
        <Sparkles size={14} className="animate-pulse" />
      </button>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: TransactionHistory }) {
  const isDeposit = transaction.type === 'deposit';

  return (
    <div className="transaction-item flex items-start p-3 bg-black/40 border border-white/10 rounded-lg hover:bg-black/50 transition-colors">
      <div className={`transaction-icon mr-3 p-2 rounded-full ${isDeposit ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-500'}`}>
        {isDeposit ? (
          <ArrowDownRight size={16} />
        ) : (
          <ArrowUpRight size={16} />
        )}
      </div>
      <div className="transaction-content flex-1 min-w-0">
        <div className="transaction-header flex justify-between items-start mb-1">
          <span className="transaction-title text-sm font-medium">
            {isDeposit ? 'Deposit to' : 'Withdraw from'} {transaction.vaultName}
          </span>
          <span className="transaction-time text-xs text-white/60">{formatTimeAgo(transaction.timestamp)}</span>
        </div>
        <div className="transaction-details flex justify-between items-center">
          <span className="transaction-amount text-xs font-mono">
            ${transaction.amount.toLocaleString()}
          </span>
          <span className="transaction-status">
            <Badge variant="outline" className={getStatusBadgeClasses(transaction.status)}>
              {capitalizeFirstLetter(transaction.status)}
            </Badge>
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyTabContent({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <RefreshCw size={20} className="text-white/40" />
      </div>
      <p className="text-white/60 max-w-xs mx-auto">{message}</p>
    </div>
  );
}

function ActivitySkeletonLoader() {
  return (
    <Card className="activity-panel border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-10 bg-white/10 rounded-lg animate-pulse mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-black/40 border border-white/10 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyActivityState() {
  return (
    <Card className="activity-panel border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Clock size={24} className="text-white/40" />
        </div>
        <h3 className="text-lg font-medium mb-2">No activity yet</h3>
        <p className="text-white/60 max-w-md mb-6">
          Deposit into a vault to start generating yield and see your activity here.
        </p>
      </CardContent>
    </Card>
  );
}

// Helper functions
function formatTimeAgo(timestamp: string): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald/10 text-emerald border-emerald/30';
    case 'pending':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    case 'failed':
      return 'bg-red-500/10 text-red-500 border-red-500/30';
    default:
      return 'bg-white/10 text-white/60 border-white/30';
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
