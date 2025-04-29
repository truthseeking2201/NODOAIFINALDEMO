import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { vaultService } from "@/services/vaultService";
import { TransactionHistory } from "@/types/vault";
import { TransactionDetailDrawer } from "@/components/dashboard/TransactionDetailDrawer";
import { Brain, ArrowUpRight, RefreshCw } from "lucide-react";

export function ActivityTabs() {
  const [currentTab, setCurrentTab] = useState<"ai-activity" | "my-transactions">("ai-activity");
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistory | null>(null);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fetch transactions
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Use mock data directly for demo purposes
      setTransactions(createMockTransactions());
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Use mock data on error
      setTransactions(createMockTransactions());
    } finally {
      setLoading(false);
    }
  };

  const createMockTransactions = (): TransactionHistory[] => [
    {
      id: "user-1",
      type: "deposit",
      amount: 5000,
      vaultId: "deep-sui",
      vaultName: "DEEP-SUI",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-2",
      type: "deposit",
      amount: 2500,
      vaultId: "cetus-sui",
      vaultName: "CETUS-SUI",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-3",
      type: "withdraw",
      amount: 1200,
      vaultId: "sui-usdc",
      vaultName: "SUI-USDC",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-4",
      type: "deposit",
      amount: 8000,
      vaultId: "deep-eth",
      vaultName: "DEEP-ETH",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-5",
      type: "deposit",
      amount: 3700,
      vaultId: "cetus-eth",
      vaultName: "CETUS-ETH",
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-6",
      type: "withdraw",
      amount: 2200,
      vaultId: "deep-eth",
      vaultName: "DEEP-ETH",
      timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-7",
      type: "deposit",
      amount: 4500,
      vaultId: "deep-sui",
      vaultName: "DEEP-SUI",
      timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-8",
      type: "deposit",
      amount: 7500,
      vaultId: "cetus-sui",
      vaultName: "CETUS-SUI",
      timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-9",
      type: "withdraw",
      amount: 3000,
      vaultId: "sui-usdc",
      vaultName: "SUI-USDC",
      timestamp: new Date(Date.now() - 216 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: "user-10",
      type: "deposit",
      amount: 10000,
      vaultId: "deep-eth",
      vaultName: "DEEP-ETH",
      timestamp: new Date(Date.now() - 240 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    }
  ];

  const handleTransactionClick = (transaction: TransactionHistory) => {
    setSelectedTransaction(transaction);
    setIsTransactionDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="ai-activity"
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as "ai-activity" | "my-transactions")}
      >
        <TabsList className="grid grid-cols-2 mb-4 w-full bg-white/5 p-1 rounded-lg">
          <TabsTrigger
            value="ai-activity"
            className="tab-trigger data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500 data-[state=active]:text-black"
          >
            <Brain size={14} className="mr-1" />
            AI Activity
          </TabsTrigger>
          <TabsTrigger
            value="my-transactions"
            className="tab-trigger data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-500 data-[state=active]:text-black"
          >
            <ArrowUpRight size={14} className="mr-1" />
            My Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-activity" className="tab-content">
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
              <Brain className="text-white/60" size={24} />
            </div>
            <p className="text-white/70 max-w-xs mx-auto">
              AI activity will be displayed here as our AI optimizes your positions.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="my-transactions" className="tab-content">
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => handleTransactionClick(tx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${
                        tx.type === "deposit" ? "bg-emerald/10" : "bg-red-500/10"
                      } flex items-center justify-center`}>
                        {tx.type === "deposit" ? (
                          <ArrowUpRight className="text-emerald" size={16} />
                        ) : (
                          <ArrowUpRight className="text-red-500" size={16} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {tx.type === "deposit" ? "Deposit to" : "Withdraw from"} {tx.vaultName}
                        </div>
                        <div className="text-xs text-white/60">
                          ${tx.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
                <RefreshCw className="text-white/60" size={24} />
              </div>
              <p className="text-white/70 max-w-xs mx-auto">
                Loading transactions...
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        open={isTransactionDrawerOpen}
        onClose={() => setIsTransactionDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
