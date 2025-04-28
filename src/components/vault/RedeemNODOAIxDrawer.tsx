import { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { Ticket, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RedeemNODOAIxDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function RedeemNODOAIxDrawer({ open, onClose }: RedeemNODOAIxDrawerProps) {
  const { balance, withdraw } = useWallet();
  const [amount, setAmount] = useState<string>(balance.receiptTokens.toString());
  const [step, setStep] = useState<'amount' | 'confirming' | 'success'>('amount');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // Redeem mutation
  const redeemMutation = useMutation({
    mutationFn: async (amount: number) => {
      setIsProcessing(true);
      try {
        // First use the vaultService to create a transaction record
        await vaultService.redeemNODOAIxTokens(amount);

        // Then use the wallet's withdraw method to process the token burning
        const result = await withdraw('nodoaix-tokens', amount);
        if (!result.success) {
          throw new Error("Redemption failed");
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setStep('success');
      setIsProcessing(false);
      // Invalidate relevant queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userInvestments'] });
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Redemption Failed",
        description: "There was an error processing your redemption. Please try again.",
        variant: "destructive"
      });
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    setAmount(balance.receiptTokens.toString());
  };

  const handleRedeemClick = () => {
    setStep('confirming');
  };

  const handleConfirmRedeem = () => {
    if (!amount) return;
    redeemMutation.mutate(parseFloat(amount));
  };

  const amountNum = parseFloat(amount || "0");
  const isAmountValid = amount !== "" && !isNaN(amountNum) && amountNum > 0 && amountNum <= balance.receiptTokens;

  // Calculate estimated USDC value (1:1 ratio with small fee)
  const estimatedUSDC = isAmountValid ? amountNum * 0.98 : 0; // 2% fee
  const networkFee = 0.01; // $0.01 fee

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-[#0c0c10] border-t border-white/10 text-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-2xl flex items-center gradient-text-amber">
              <Ticket className="h-5 w-5 text-amber-500 mr-2" />
              Redeem NODOAIx Tokens
            </DrawerTitle>
            <DrawerDescription>
              {step === 'amount' && "Convert your NODOAIx Tokens back to USDC"}
              {step === 'confirming' && "Confirm your redemption"}
              {step === 'success' && "Your redemption was successful"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            {step === 'amount' && (
              <div className="space-y-6">
                <Alert className="border-amber-800/50 bg-amber-950/20">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-sm text-amber-200">
                    NODOAIx Tokens burn upon redemption, converting back to USDC with all accrued yield.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Amount (NODOAIx)</Label>
                    <div className="text-xs text-white/60">
                      Available: <span className="font-mono">{balance.receiptTokens.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="font-mono bg-white/5 border-white/20"
                    />
                    <Button type="button" variant="secondary" onClick={handleMaxClick}>
                      Max
                    </Button>
                  </div>
                  {amount && !isAmountValid && (
                    <p className="text-red-500 text-xs">
                      {amountNum > balance.receiptTokens
                        ? "Insufficient balance"
                        : "Please enter a valid amount"}
                    </p>
                  )}
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-sm text-white/60 mb-3">Redemption Summary</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>NODOAIx Tokens</span>
                      <span className="font-mono">{isAmountValid ? amountNum.toFixed(2) : "0.00"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-mono">1 NODOAIx ≈ 0.98 USDC</span>
                    </div>

                    <div className="border-t border-white/10 my-2"></div>

                    <div className="flex justify-between">
                      <span>Estimated USDC</span>
                      <span className="font-mono font-bold">
                        {formatCurrency(estimatedUSDC)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <DrawerClose asChild>
                    <Button variant="outline" className="bg-white/5 border-white/20">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button
                    onClick={handleRedeemClick}
                    disabled={!isAmountValid}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-neon-amber"
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            )}

            {step === 'confirming' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 text-center">Confirm Redemption</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">NODOAIx Tokens</span>
                      <span className="font-medium gradient-text-amber">
                        {parseFloat(amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Estimated USDC</span>
                      <span className="font-mono font-medium">{formatCurrency(estimatedUSDC)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Network Fee</span>
                      <span className="font-mono">~{formatCurrency(networkFee)}</span>
                    </div>

                    <div className="border-t border-white/10 my-2"></div>

                    <div className="flex justify-between">
                      <span className="text-white/60">You will receive</span>
                      <span className="font-mono font-medium">
                        {formatCurrency(estimatedUSDC - networkFee)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/20"
                    disabled={isProcessing}
                    onClick={() => setStep('amount')}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmRedeem}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-neon-amber"
                  >
                    {isProcessing ? "Processing..." : "Confirm Redemption"}
                  </Button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Redemption Successful!</h3>
                  <p className="text-white/60">
                    Your NODOAIx tokens have been redeemed for {formatCurrency(estimatedUSDC - networkFee)}.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Tokens Redeemed</span>
                      <span className="font-mono">{parseFloat(amount).toFixed(2)} NODOAIx</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">USDC Received</span>
                      <span className="font-mono">{formatCurrency(estimatedUSDC - networkFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Transaction ID</span>
                      <span className="font-mono text-xs">0x87...3f2a</span>
                    </div>
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-neon-amber"
                  >
                    Close
                  </Button>
                </DrawerFooter>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
