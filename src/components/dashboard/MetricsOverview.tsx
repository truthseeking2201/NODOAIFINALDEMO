import { UserInvestment } from "@/types/vault";
import { Card } from "@/components/ui/card";
import {
  Landmark,
  TrendingUp,
  LineChart,
  ShieldCheck,
  Percent,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MetricsOverviewProps {
  investments: UserInvestment[];
  isLoading: boolean;
}

export function MetricsOverview({ investments, isLoading }: MetricsOverviewProps) {
  // Animation states
  const [animatedTotalDeposited, setAnimatedTotalDeposited] = useState(0);
  const [animatedTotalValue, setAnimatedTotalValue] = useState(0);
  const [animatedTotalProfit, setAnimatedTotalProfit] = useState(0);
  const [animatedAvgApr, setAnimatedAvgApr] = useState(0);

  // Calculations
  const totalDeposited = investments.reduce((sum, inv) => sum + inv.principal, 0);
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = investments.reduce((sum, inv) => sum + inv.profit, 0);
  const avgApr = investments.length ?
    investments.reduce((sum, inv) => sum + (inv.currentValue * (inv.currentApr || calculateEstimatedApr(inv.vaultId))), 0) / totalValue : 0;
  const capitalDeployed = 72; // Mock value, replace with actual calculation

  // Risk level determination
  const determineRiskLevel = () => {
    const highRiskValue = investments
      .filter(inv => inv.vaultId.includes('deep'))
      .reduce((sum, inv) => sum + inv.currentValue, 0);

    const totalVal = totalValue || 1; // Prevent division by zero
    const highRiskPercentage = (highRiskValue / totalVal) * 100;

    if (highRiskPercentage > 50) return 'high';
    if (highRiskPercentage > 20) return 'medium';
    return 'low';
  };

  const riskLevel = determineRiskLevel();

  // Animate values on component mount or when values change
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

      setAnimatedTotalDeposited(totalDeposited * easeProgress);
      setAnimatedTotalValue(totalValue * easeProgress);
      setAnimatedTotalProfit(totalProfit * easeProgress);
      setAnimatedAvgApr(avgApr * easeProgress);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTotalDeposited(totalDeposited);
        setAnimatedTotalValue(totalValue);
        setAnimatedTotalProfit(totalProfit);
        setAnimatedAvgApr(avgApr);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, totalDeposited, totalValue, totalProfit, avgApr]);

  if (isLoading) {
    return <MetricsSkeletonLoader />;
  }

  return (
    <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="metric-card bg-black/20 border border-white/10 backdrop-blur-sm p-6">
        <div className="flex items-start gap-3">
          <div className="metric-icon h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Landmark size={20} className="text-white/60" />
          </div>
          <div className="metric-content">
            <h3 className="metric-title text-sm font-medium text-white/70 mb-1">Total Deposited</h3>
            <p className="metric-value text-2xl font-bold font-mono">${Math.round(animatedTotalDeposited).toLocaleString()}</p>
            <p className="metric-subtitle text-xs text-white/50 mt-1">
              NODOAIx Tokens: {(animatedTotalDeposited * 0.98).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="metric-card bg-black/20 border border-white/10 backdrop-blur-sm p-6">
        <div className="flex items-start gap-3">
          <div className="metric-icon h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
            <LineChart size={20} className="text-white/60" />
          </div>
          <div className="metric-content">
            <h3 className="metric-title text-sm font-medium text-white/70 mb-1">Live APR</h3>
            <motion.p
              className="metric-value text-2xl font-bold font-mono"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              {animatedAvgApr.toFixed(2)}%
            </motion.p>
            <p className="metric-subtitle text-xs text-white/50 mt-1">
              Weighted across all investments
            </p>
          </div>
        </div>
      </Card>

      <Card className="metric-card bg-black/20 border border-white/10 backdrop-blur-sm p-6">
        <div className="flex items-start gap-3">
          <div className="metric-icon h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
            <TrendingUp size={20} className="text-white/60" />
          </div>
          <div className="metric-content">
            <h3 className="metric-title text-sm font-medium text-white/70 mb-1">Total Profit</h3>
            <p className={`metric-value text-2xl font-bold font-mono ${totalProfit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
              {totalProfit >= 0 ? '+' : ''}{Math.round(animatedTotalProfit).toLocaleString()}
            </p>
            <p className="metric-subtitle text-xs text-white/50 mt-1">
              Current Value: ${Math.round(animatedTotalValue).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="metric-card bg-black/20 border border-white/10 backdrop-blur-sm p-6">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="metric-title text-sm font-medium text-white/70">Risk Profile</h3>
            <span className={`risk-badge text-xs px-2 py-1 rounded-full flex items-center ${getRiskBadgeClasses(riskLevel)}`}>
              <ShieldCheck size={14} className="mr-1" />
              {capitalizeFirstLetter(riskLevel)} Risk
            </span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capital-deployed">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/60 flex items-center">
                      Capital deployed
                      <Info size={12} className="ml-1 text-white/40" />
                    </span>
                    <span className="text-xs font-medium">{capitalDeployed}%</span>
                  </div>
                  <div className="progress-bar h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`progress-fill h-full ${getProgressFillClasses(riskLevel)}`}
                      style={{ width: `${capitalDeployed}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-[200px]">
                  Percentage of your funds currently active in yield-generating positions
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 flex items-end mt-4">
            <motion.div
              className="text-xs text-white/50 flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 4, delay: 2 }}
            >
              <Percent size={10} className="text-white/60" />
              <span>AI continuously optimizing your risk exposure</span>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricsSkeletonLoader() {
  return (
    <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="metric-card bg-black/20 border-white/10 overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                  <div className="h-7 w-28 bg-white/10 rounded"></div>
                  <div className="h-3 w-32 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper functions
function calculateEstimatedApr(vaultId: string): number {
  if (vaultId.includes('deep')) return 21.5;
  if (vaultId.includes('cetus')) return 18.9;
  return 15.2;
}

function getRiskBadgeClasses(riskLevel: string): string {
  switch (riskLevel) {
    case 'high':
      return 'bg-nova/20 text-nova border border-nova/30';
    case 'medium':
      return 'bg-orion/20 text-orion border border-orion/30';
    case 'low':
    default:
      return 'bg-emerald/20 text-emerald border border-emerald/30';
  }
}

function getProgressFillClasses(riskLevel: string): string {
  switch (riskLevel) {
    case 'high':
      return 'bg-gradient-to-r from-red-500 to-amber-500';
    case 'medium':
      return 'bg-gradient-to-r from-amber-500 to-emerald';
    case 'low':
    default:
      return 'bg-gradient-to-r from-emerald to-emerald-dark';
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
