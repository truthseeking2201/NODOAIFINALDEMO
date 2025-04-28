import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  BarChart3,
  Shield,
  Info
} from "lucide-react";
import { UserInvestment } from "@/types/vault";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VaultMetricsHeaderProps {
  investments: UserInvestment[];
  className?: string;
}

export function VaultMetricsHeader({ investments, className = "" }: VaultMetricsHeaderProps) {
  // Calculate total metrics from investments
  const totalDeposited = investments.reduce((sum, inv) => sum + inv.principal, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = investments.reduce((sum, inv) => sum + inv.profit, 0);

  // Calculate weighted average APR
  const weightedApr = investments.length > 0 ? investments.reduce((sum, inv) => {
    // Avoid division by zero if totalDeposited is 0
    const weight = totalDeposited > 0 ? inv.principal / totalDeposited : 0;
    return sum + (inv.currentApr || 0) * weight;
  }, 0) : 0;

  // Risk level calculation (mock)
  const capitalDeployed = 72; // Would be dynamically calculated in real implementation
  const riskLevel = "Low"; // Would be dynamically calculated based on investments

  // Token balance (mock)
  const nodoAIxTokens = investments.length > 0 ? totalDeposited * 0.98 : 0; // Simulated token balance

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {/* Total Deposited */}
      <Card className="glass-card rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-5 flex justify-between items-center">
            <div>
              <div className="flex items-center text-white/60 mb-1 text-sm">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Total Deposited</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalDeposited)}
              </div>
              <div className="mt-1 text-xs text-white/60 flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      <span>NODOAIx Tokens: {nodoAIxTokens.toFixed(2)}</span>
                      <Info className="h-3 w-3 ml-1 text-white/40" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[250px] text-xs">
                        NODOAIx Tokens represent your AI-optimized yield position. They automatically adapt to market conditions, leveraging AI algorithms to maximize returns. Burns on withdrawal — non-transferable.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live APR */}
      <Card className="glass-card rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-5 flex justify-between items-center">
            <div>
              <div className="flex items-center text-white/60 mb-1 text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Live APR</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {weightedApr.toFixed(2)}%
              </div>
              <div className="mt-1 text-xs text-white/60">
                Weighted across all investments
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Profit */}
      <Card className="glass-card rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-5 flex justify-between items-center">
            <div>
              <div className="flex items-center text-white/60 mb-1 text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Total Profit</span>
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                +{formatCurrency(totalProfit)}
              </div>
              <div className="mt-1 text-xs text-white/60">
                Current Value: {formatCurrency(totalCurrentValue)}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      <Card className="glass-card rounded-[20px] border border-white/[0.06] bg-[#101112] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-5 flex justify-between items-center">
            <div>
              <div className="flex items-center text-white/60 mb-1 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                <span>Risk Profile</span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-emerald-500/20 text-emerald-500 border-none rounded-full py-0.5 px-3">
                  {riskLevel} Risk
                </Badge>
              </div>
              <div className="mt-1 text-xs text-white/60">
                Capital deployed: {capitalDeployed}%
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
