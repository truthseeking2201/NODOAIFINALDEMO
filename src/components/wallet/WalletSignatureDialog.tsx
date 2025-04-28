import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface WalletSignatureDialogProps {
  open: boolean;
  onComplete: () => void;
  transactionType: 'deposit' | 'withdraw';
  amount?: string;
  vaultName?: string;
}

export function WalletSignatureDialog({
  open,
  onComplete,
  transactionType,
  amount,
  vaultName
}: WalletSignatureDialogProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'awaiting' | 'processing' | 'completed'>('awaiting');

  useEffect(() => {
    if (open) {
      setProgress(0);
      setStatus('awaiting');

      // Simulate waiting for user to sign in the wallet
      const timer1 = setTimeout(() => {
        setStatus('processing');

        // Start progress simulation
        const timer2 = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            if (newProgress >= 100) {
              clearInterval(timer2);
              setStatus('completed');
              setTimeout(() => {
                onComplete();
              }, 500);
              return 100;
            }
            return newProgress;
          });
        }, 300);

        return () => clearInterval(timer2);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        // Reset state when dialog closes
        setProgress(0);
        setStatus('awaiting');
      };
    }
  }, [open, onComplete]);

  const getStatusText = () => {
    switch (status) {
      case 'awaiting':
        return "Awaiting Signature";
      case 'processing':
        return "Processing Transaction";
      case 'completed':
        return "Transaction Complete";
    }
  };

  const getDetailText = () => {
    switch (status) {
      case 'awaiting':
        return "Please check your Sui Wallet to sign this transaction";
      case 'processing':
        return "Your transaction is being processed on the Sui blockchain";
      case 'completed':
        return "Your transaction has been confirmed";
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] bg-[#101112] border border-white/10 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1">
          <Progress value={progress} className="w-full h-full rounded-none" indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500" />
        </div>
        <DialogHeader className="text-center pt-10">
          <DialogTitle className="text-xl font-bold">
            {getStatusText()}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {getDetailText()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-8">
          {status === 'awaiting' && (
            <div className="rounded-full w-20 h-20 bg-white/5 flex items-center justify-center animate-pulse">
              <svg width="40" height="40" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.0379 42.0606L69.0805 26.1006C65.444 22.464 59.582 22.464 55.9454 26.1006L39.988 42.0606C36.3514 45.6972 36.3514 51.5593 39.988 55.1959L55.9454 71.1559C59.582 74.7924 65.444 74.7924 69.0805 71.1559L85.0379 55.1959C88.6745 51.5593 88.6745 45.6972 85.0379 42.0606Z" fill="#4DA1F9"/>
                <path d="M85.0379 72.8041L69.0805 56.8441C65.444 53.2076 59.582 53.2076 55.9454 56.8441L39.988 72.8041C36.3514 76.4407 36.3514 82.3028 39.988 85.9393L55.9454 101.899C59.582 105.536 65.444 105.536 69.0805 101.899L85.0379 85.9393C88.6745 82.3028 88.6745 76.4407 85.0379 72.8041Z" fill="#4DA1F9"/>
              </svg>
            </div>
          )}

          {status === 'processing' && (
            <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
          )}

          {status === 'completed' && (
            <div className="rounded-full w-20 h-20 bg-emerald-500/20 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Transaction details */}
          <div className="mt-6 bg-white/5 rounded-xl p-4 w-full max-w-[300px]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Transaction Type:</span>
              <span className="font-medium capitalize">{transactionType}</span>
            </div>
            {amount && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Amount:</span>
                <span className="font-medium">{parseFloat(amount).toLocaleString()} USDC</span>
              </div>
            )}
            {vaultName && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Vault:</span>
                <span className="font-medium">{vaultName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pb-6">
          <p className="text-xs text-white/60">
            {status === 'awaiting' && "Don't see the signature request? Check that your wallet is unlocked."}
            {status === 'processing' && "This may take a few moments to confirm on the blockchain."}
            {status === 'completed' && "You will be automatically redirected."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
