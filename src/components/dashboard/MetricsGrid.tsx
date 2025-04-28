import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Landmark,
  LineChart,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Gauge,
  ChevronUp,
  ChevronDown,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserInvestment } from "@/types/vault";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface MetricsGridProps {
  isLoading: boolean;
  totalDeposited: number;
  totalValue: number;
  totalProfit: number;
  avgApr: number;
  investments: UserInvestment[];
}

export function MetricsGrid({
  isLoading,
  totalDeposited,
  totalValue,
  totalProfit,
  avgApr,
  investments
}: MetricsGridProps) {
  const [capitalDeployed, setCapitalDeployed] = useState(72); // Mock value in %
  const [animatedProfit, setAnimatedProfit] = useState(0);
  const [animatedDeposited, setAnimatedDeposited] = useState(0);
  const [animatedApr, setAnimatedApr] = useState(0);

  // Animate values on component mount
  useEffect(() => {
    if (isLoading) return;

    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of steps in animation
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      // Use easeOutExpo for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedDeposited(totalDeposited * easeProgress);
      setAnimatedProfit(totalProfit * easeProgress);
      setAnimatedApr(avgApr * easeProgress);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedDeposited(totalDeposited);
        setAnimatedProfit(totalProfit);
        setAnimatedApr(avgApr);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, totalDeposited, totalProfit, avgApr]);

  // Determine risk level based on investments
  const determineRiskLevel = () => {
    if (!investments || investments.length === 0) return "low";

    const highRiskValue = investments
      .filter(inv => inv.vaultId.includes('deep'))
      .reduce((sum, inv) => sum + inv.currentValue, 0);

    const mediumRiskValue = investments
      .filter(inv => inv.vaultId.includes('cetus'))
      .reduce((sum, inv) => sum + inv.currentValue, 0);

    const totalVal = totalValue || 1; // Prevent division by zero
    const highRiskPercentage = (highRiskValue / totalVal) * 100;
    const mediumRiskPercentage = (mediumRiskValue / totalVal) * 100;

    if (highRiskPercentage > 50) return "high";
    if (highRiskPercentage + mediumRiskPercentage > 70) return "medium";
    return "low";
  };

  const riskLevel = determineRiskLevel();

  // Risk badge component
  const RiskBadge = () => {
    switch (riskLevel) {
      case "high":
        return (
          <Badge variant="outline" className="bg-nova/20 text-nova border-nova/30 flex items-center gap-1 py-1">
            <AlertTriangle size={12} />
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-orion/20 text-orion border-orion/30 flex items-center gap-1 py-1">
            <Gauge size={12} />
            Medium Risk
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge variant="outline" className="bg-emerald/20 text-emerald border-emerald/30 flex items-center gap-1 py-1">
            <ShieldCheck size={12} />
            Low Risk
          </Badge>
        );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-black/20 border-white/10 overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-8 w-28 bg-white/10 rounded"></div>
                <div className="h-4 w-32 bg-white/10 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Deposited */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-black/30 transition-all duration-300">
        <div className="h-1 bg-gradient-to-r from-[#FF8A00]/80 to-[#FF6B00]/80 opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Landmark className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-1">Total Deposited</h3>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                ${Math.round(animatedDeposited).toLocaleString()}
              </div>
              <p className="text-xs text-white/50 mt-1">
                NODOAIx Tokens: {(animatedDeposited * 0.98).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live APR */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-black/30 transition-all duration-300">
        <div className="h-1 bg-gradient-to-r from-[#FF8A00]/80 to-[#FF6B00]/80 opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
              <LineChart className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-1">Live APR</h3>
              <motion.div
                className="text-2xl font-bold text-white font-mono tracking-tight flex items-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                {animatedApr.toFixed(2)}%
                <span className="ml-2 text-xs px-1.5 py-0.5 bg-emerald/20 text-emerald rounded-sm">AI Optimized</span>
              </motion.div>
              <p className="text-xs text-white/50 mt-1">
                Weighted across all investments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Profit */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-black/30 transition-all duration-300">
        <div className="h-1 bg-gradient-to-r from-[#FF8A00]/80 to-[#FF6B00]/80 opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-1">Total Profit</h3>
              <div className="text-2xl font-bold font-mono tracking-tight flex items-center">
                <span className={totalProfit >= 0 ? "text-emerald" : "text-red-500"}>
                  {totalProfit >= 0 ? "+" : ""}${Math.round(animatedProfit).toLocaleString()}
                </span>
                {totalProfit !== 0 && (
                  <span className="ml-2">
                    {totalProfit > 0 ?
                      <ChevronUp className="h-4 w-4 text-emerald" /> :
                      <ChevronDown className="h-4 w-4 text-red-500" />
                    }
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 mt-1">
                Current Value: ${Math.round(totalValue).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Profile */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-black/30 transition-all duration-300">
        <div className="h-1 bg-gradient-to-r from-[#FF8A00]/80 to-[#FF6B00]/80 opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-white/70">Risk Profile</h3>
              <RiskBadge />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        Capital deployed
                        <Info className="h-3 w-3 text-white/30" />
                      </span>
                      <span className="text-xs text-white/70 font-medium">{capitalDeployed}%</span>
                    </div>
                    <Progress
                      value={capitalDeployed}
                      className="h-2 bg-white/5"
                      indicatorClassName={`${
                        riskLevel === "high"
                          ? "bg-gradient-to-r from-red-500 to-amber-500"
                          : riskLevel === "medium"
                            ? "bg-gradient-to-r from-amber-500 to-emerald"
                            : "bg-gradient-to-r from-emerald to-emerald-dark"
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs max-w-[200px]">
                    Percentage of your funds currently active in yield-generating positions
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1 flex items-end">
              <motion.div
                className="text-xs text-white/50 flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4, delay: 2 }}
              >
                <Gauge size={10} className="text-white/60" />
                <span>AI continuously optimizing your risk exposure</span>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
