import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Ticket, ArrowRightCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ReceiptTokenCardProps {
  tokens: number;
  onRedeem: () => void;
}

export function ReceiptTokenCard({ tokens, onRedeem }: ReceiptTokenCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Format with 2 decimal places
  const formattedTokens = tokens.toFixed(2);

  // Animate token value on mount
  useEffect(() => {
    const targetValue = parseFloat(formattedTokens);
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
  }, [formattedTokens]);

  return (
    <Card className="receipt-token-card bg-black/20 border border-white/10 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00]" />
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Ticket className="h-4 w-4 text-amber-500 mr-2" />
            NODOAIx Tokens
          </CardTitle>
          <CardDescription>
            Your intelligent yield tokens that will burn on withdrawal
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
                NODOAIx Tokens represent your position in the AI-optimized vault and are automatically minted when you deposit.
                These intelligent tokens adapt to market conditions, leveraging AI algorithms to maximize yield.
                They serve as proof of your deposit and will burn automatically when you withdraw.
                These tokens are non-transferable and remain linked to your wallet.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
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
              1 token ≈ 1 USDC
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onRedeem}
          variant="outline"
          className="w-full border-amber-500/30 hover:bg-amber-500/10 text-amber-500 flex items-center justify-center gap-2"
        >
          Redeem Tokens
          <ArrowRightCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
