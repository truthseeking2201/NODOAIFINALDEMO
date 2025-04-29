import React from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { TransactionHistory } from "@/types/vault";

interface TransactionDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  transaction: TransactionHistory | null;
}

export function TransactionDetailDrawer({ open, onClose, transaction }: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const isDeposit = transaction.type === 'deposit';
  const isCompleted = transaction.status === 'completed';
  const isPending = transaction.status === 'pending';

  // Format date and time from timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMMM d, yyyy");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "h:mm a");
  };

  const formatTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Generate transaction ID for display
  const displayId = transaction.id.slice(0, 4) + '...' + transaction.id.slice(-4);

  return (
    <Drawer
      open={open}
      onOpenChange={(newOpen) => !newOpen && onClose()}
      modal={true}
    >
      <DrawerContent className="max-w-[450px] sm:max-w-[550px] h-[90vh] rounded-t-xl bg-card border-t border-white/10">
        <div className="h-full rounded-t-xl overflow-hidden">
          <DrawerHeader className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </DrawerClose>
              <DrawerTitle className="text-lg font-medium">
                Transaction Details
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="card-padding overflow-y-auto h-[calc(90vh-64px)] p-6">
            <div className="mb-8">
              <div className={`w-16 h-16 rounded-full ${isDeposit ? 'bg-emerald/10' : 'bg-red-500/10'} flex items-center justify-center mb-4 mx-auto`}>
                {isDeposit ? (
                  <ArrowDownRight size={32} className="text-emerald" />
                ) : (
                  <ArrowUpRight size={32} className="text-red-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-center mb-1">
                ${transaction.amount.toLocaleString()}
              </h2>
              <p className="text-center text-white/60 mb-1">
                {isDeposit ? 'Deposit to' : 'Withdrawal from'} {transaction.vaultName}
              </p>
              <div className="flex justify-center">
                <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                  isCompleted
                    ? 'bg-emerald/10 text-emerald'
                    : isPending
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={14} />
                  ) : isPending ? (
                    <Clock size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <span className="text-sm font-medium capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sm text-white/60 mb-2">Transaction Date</h3>
                <div className="flex justify-between items-center">
                  <p className="font-medium">{formatDate(transaction.timestamp)}</p>
                  <p className="text-sm text-white/60">{formatTime(transaction.timestamp)}</p>
                </div>
                <p className="text-sm text-white/60 mt-1">{formatTimeAgo(transaction.timestamp)}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sm text-white/60 mb-2">Transaction Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Type</span>
                    <span className="font-medium capitalize">{transaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Vault</span>
                    <span className="font-medium">{transaction.vaultName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount</span>
                    <span className="font-medium">${transaction.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Transaction ID</span>
                    <span className="font-mono text-sm">{displayId}</span>
                  </div>
                </div>
              </div>

              {isDeposit && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-white/60 mb-2">Deposit Information</h3>
                  <p className="text-sm text-white/80">
                    Your funds have been successfully added to the {transaction.vaultName} vault.
                    They are now actively generating yield according to the vault's strategy.
                  </p>
                </div>
              )}

              {!isDeposit && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-white/60 mb-2">Withdrawal Information</h3>
                  <p className="text-sm text-white/80">
                    Your funds have been successfully withdrawn from the {transaction.vaultName} vault
                    and are now available in your wallet.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
