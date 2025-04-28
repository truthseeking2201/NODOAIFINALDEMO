import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  BarChart4,
  Wallet,
  RefreshCw,
  Zap,
  Check,
  ShieldCheck,
  User
} from "lucide-react";

interface AITransactionTickerProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  maxItems?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'swap' | 'optimize' | 'rebalance' | 'secure';
  amount: string;
  asset: string;
  timestamp: Date;
  address: string;
  optimized: boolean;
  aiScore: number;
  isUserTransaction?: boolean;
}

export function AITransactionTicker({
  vaultType,
  maxItems = 8
}: AITransactionTickerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all-transactions");

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        border: 'border-nova/20',
        fill: 'bg-nova'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        border: 'border-orion/20',
        fill: 'bg-orion'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        border: 'border-emerald/20',
        fill: 'bg-emerald'
      };
    }
  };

  const colors = getTypeColor();

  // Generate a random transaction
  const generateTransaction = (isUserTx: boolean = false): Transaction => {
    const types: ('deposit' | 'withdraw' | 'swap' | 'optimize' | 'rebalance' | 'secure')[] =
      isUserTx ? ['deposit', 'withdraw'] : ['deposit', 'withdraw', 'swap', 'optimize', 'rebalance', 'secure'];

    const randomType = types[Math.floor(Math.random() * types.length)];

    const assets = vaultType === 'nova' ? ['DEEP', 'SUI'] :
                 vaultType === 'orion' ? ['CETUS', 'SUI'] :
                 ['SUI', 'USDC'];

    // Generate random wallet address
    const chars = '0123456789abcdef';
    let address = '0x';

    // For user transactions, use a consistent address
    if (isUserTx) {
      address = '0x7d783c975da6e3b5ff8259436d4f7da675da6';
    } else {
      for (let i = 0; i < 6; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
      }
      address += '...';
      for (let i = 0; i < 4; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    // Generate random amount based on transaction type
    let amount = '';
    let asset = '';

    if (randomType === 'deposit' || randomType === 'withdraw') {
      amount = (Math.random() * 1000 + 50).toFixed(2);
      asset = assets[Math.floor(Math.random() * assets.length)];
    } else if (randomType === 'swap') {
      amount = (Math.random() * 500 + 20).toFixed(2);
      asset = `${assets[0]} → ${assets[1]}`;
    } else if (randomType === 'optimize' || randomType === 'rebalance') {
      amount = (Math.random() * 2000 + 100).toFixed(2);
      asset = 'POOL';
    } else {
      amount = '';
      asset = 'VAULT';
    }

    return {
      id: Date.now().toString() + Math.random().toString().slice(2, 8),
      type: randomType,
      amount,
      asset,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000), // Random date within last 10 days
      address,
      optimized: Math.random() > 0.3,
      aiScore: Math.floor(Math.random() * 30) + 70,
      isUserTransaction: isUserTx
    };
  };

  useEffect(() => {
    // Generate initial set of transactions
    const initialTransactions = Array.from({ length: 5 }, (_, index) => {
      const tx = generateTransaction();
      tx.timestamp = new Date(Date.now() - (index * 60000)); // Each one minute older
      return tx;
    });

    // Generate initial set of user transactions
    const initialUserTransactions = Array.from({ length: 3 }, (_, index) => {
      const tx = generateTransaction(true);
      tx.timestamp = new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)); // Each 3 days older
      return tx;
    });

    setTransactions(initialTransactions);
    setUserTransactions(initialUserTransactions);

    // Add new transactions periodically
    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      setLatestTransaction(newTransaction);

      setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        return updated.slice(0, maxItems);
      });

      // Occasionally add user transactions too (20% chance)
      if (Math.random() < 0.2) {
        const newUserTx = generateTransaction(true);
        setUserTransactions(prev => {
          const updated = [newUserTx, ...prev];
          return updated.slice(0, maxItems);
        });
      }
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [maxItems]);

  // Get icon for transaction type
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="text-green-500" size={16} />;
      case 'withdraw':
        return <ArrowDownRight className="text-red-500" size={16} />;
      case 'swap':
        return <RefreshCw className={colors.primary} size={16} />;
      case 'optimize':
        return <Brain className={colors.primary} size={16} />;
      case 'rebalance':
        return <BarChart4 className={colors.primary} size={16} />;
      case 'secure':
        return <ShieldCheck className={colors.primary} size={16} />;
    }
  };

  // Get label for transaction type
  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdraw': return 'Withdraw';
      case 'swap': return 'Swap';
      case 'optimize': return 'AI Optimize';
      case 'rebalance': return 'AI Rebalance';
      case 'secure': return 'AI Security';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
            <Zap size={15} className={colors.primary} />
          </div>
          <h3 className="text-base font-medium text-white">Transactions</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-white/70">Live</span>
        </div>
      </div>

      {/* New transaction notification */}
      <AnimatePresence>
        {latestTransaction && (
          <motion.div
            className={`mb-4 p-3 rounded-lg ${colors.bg} ${colors.border} border flex items-center gap-3`}
            initial={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16, padding: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
            transition={{ duration: 0.3 }}
            key={latestTransaction.id + "-highlight"}
          >
            <div className={`p-2 rounded-lg bg-black/20`}>
              <Brain size={16} className={colors.primary} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">New AI Transaction Detected</div>
              <div className="text-xs text-white/70 mt-0.5">
                {latestTransaction.type === 'optimize' || latestTransaction.type === 'rebalance' ?
                  'Neural network optimizing vault performance' :
                  'Transaction analyzed and processed'}
              </div>
            </div>

            <div className="px-2 py-1 rounded-md bg-black/20 text-white/90 text-xs font-mono">
              {latestTransaction.type === 'optimize' || latestTransaction.type === 'rebalance' ?
                `+${(Math.random() * 0.4 + 0.1).toFixed(2)}% APR` :
                `AI Score: ${latestTransaction.aiScore}`
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs for All Transactions and My Transactions */}
      <Tabs defaultValue="all-transactions" value={activeTab} onValueChange={setActiveTab} className="mt-2">
        <TabsList className="grid grid-cols-2 bg-black/20 rounded-lg p-1 mb-4">
          <TabsTrigger
            value="all-transactions"
            className={`text-xs data-[state=active]:${colors.bg} data-[state=active]:text-white`}
          >
            All Transactions
          </TabsTrigger>
          <TabsTrigger
            value="my-transactions"
            className={`text-xs data-[state=active]:${colors.bg} data-[state=active]:text-white`}
          >
            <User className="h-3 w-3 mr-1" />
            My Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-transactions" className="mt-0 space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          <AnimatePresence>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                className="bg-white/5 rounded-lg border border-white/10 p-3 flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-2 rounded-lg bg-white/5">
                  {getTransactionIcon(tx.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm font-medium text-white truncate">
                      {getTransactionLabel(tx.type)}
                    </div>

                    {tx.optimized && (
                      <div className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium flex items-center gap-1 text-white/70">
                        <Brain size={10} className={colors.primary} />
                        AI-Optimized
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {tx.amount && (
                      <div className="text-xs font-mono text-white/90">
                        {tx.type === 'withdraw' ? '-' : ''}{tx.amount} {tx.asset}
                      </div>
                    )}

                    <div className="text-[10px] text-white/50 truncate">
                      {tx.address}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-white/40">
                  {timeAgo(tx.timestamp)}
                </div>

                {/* AI Score indicator for certain transactions */}
                {(tx.type === 'optimize' || tx.type === 'rebalance' || tx.type === 'secure') && (
                  <div className="ml-auto flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <div className={`h-1 w-5 rounded-full relative overflow-hidden bg-white/10`}>
                        <div
                          className={`absolute inset-0 ${colors.fill}`}
                          style={{width: `${tx.aiScore}%`}}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/60">{tx.aiScore}</span>
                    </div>
                    <div className="text-[8px] text-white/40 mt-0.5">AI Score</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-white/40 text-sm">
              No transactions yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-transactions" className="mt-0 space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          <AnimatePresence>
            {userTransactions.length > 0 ? (
              userTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  className="bg-white/5 rounded-lg border border-white/10 p-3 flex items-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-2 rounded-lg bg-white/5">
                    {getTransactionIcon(tx.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm font-medium text-white truncate">
                        {getTransactionLabel(tx.type)}
                      </div>

                      <div className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium flex items-center gap-1 text-white/70">
                        <User size={10} className="text-white/70" />
                        Your Transaction
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {tx.amount && (
                        <div className="text-xs font-mono text-white/90">
                          {tx.type === 'withdraw' ? '-' : ''}{tx.amount} {tx.asset}
                        </div>
                      )}

                      <div className="text-[10px] text-white/50 truncate">
                        {tx.address}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/40">
                    {timeAgo(tx.timestamp)}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/40 text-sm">
                No transactions yet. Deposit or withdraw to see your transactions here.
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Status footer */}
      <div className="mt-4 bg-white/5 rounded-lg border border-white/10 p-2 text-xs text-white/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-1.5 py-0.5 bg-white/10 rounded-md flex items-center gap-1">
            <Check size={10} className="text-green-500" />
            <span>Online</span>
          </div>
          <span>Neural Processing</span>
        </div>

        <div className="flex items-center gap-1">
          <span>{activeTab === "all-transactions" ? "AI Tx Count:" : "Your Tx Count:"}</span>
          <span className="font-mono">{
            activeTab === "all-transactions"
              ? transactions.filter(tx => tx.type === 'optimize' || tx.type === 'rebalance' || tx.type === 'secure' || tx.optimized).length
              : userTransactions.length
          }</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to format timestamps
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  if (seconds < 10) return "just now";

  return Math.floor(seconds) + "s ago";
}
