import React from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  Gauge,
  Info,
  Percent
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardsProps {
  totalDeposited: number;
  weightedAPR: number;
  totalProfit: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  capitalDeployed: number;
  isLoading: boolean;
}

export function MetricsCards({
  totalDeposited,
  weightedAPR,
  totalProfit,
  riskLevel,
  capitalDeployed,
  isLoading
}: MetricsCardsProps) {

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'Low': return <ShieldCheck className="h-4 w-4 mr-1 text-emerald" />;
      case 'Medium': return <Gauge className="h-4 w-4 mr-1 text-orion" />;
      case 'High': return <AlertTriangle className="h-4 w-4 mr-1 text-nova" />;
      default: return <ShieldCheck className="h-4 w-4 mr-1 text-emerald" />;
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low': return 'bg-emerald/20 text-emerald';
      case 'Medium': return 'bg-orion/20 text-orion';
      case 'High': return 'bg-nova/20 text-nova';
      default: return 'bg-emerald/20 text-emerald';
    }
  };

  const getCapitalDeployedStatus = () => {
    if (capitalDeployed < 30) return 'text-emerald';
    if (capitalDeployed < 70) return 'text-orion';
    return 'text-nova';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-black/30 border-white/[0.08]">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-32 mb-4 bg-white/10" />
              <Skeleton className="h-8 w-24 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-40 bg-white/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Total Deposited Card */}
      <motion.div variants={item}>
        <Card className="bg-black/30 border-white/[0.08] backdrop-blur-sm hover:bg-black/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/60 mb-1 flex items-center">
                  <Landmark className="h-3.5 w-3.5 mr-1.5 text-white/60" />
                  Total Deposited
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  ${totalDeposited.toLocaleString()}
                </span>
                <span className="text-xs text-white/60 mt-1">
                  NODOAIx Tokens: {(totalDeposited * 0.98).toFixed(2)}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <Landmark className="h-5 w-5 text-white/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Live APR Card */}
      <motion.div variants={item}>
        <Card className="bg-black/30 border-white/[0.08] backdrop-blur-sm hover:bg-black/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/60 mb-1 flex items-center">
                  <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-white/60" />
                  Live APR
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  {weightedAPR.toFixed(1)}%
                </span>
                <span className="text-xs text-white/60 mt-1">
                  Weighted across all investments
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-white/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Profit Card */}
      <motion.div variants={item}>
        <Card className="bg-black/30 border-white/[0.08] backdrop-blur-sm hover:bg-black/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/60 mb-1 flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-white/60" />
                  Total Profit
                </span>
                <span className={`text-2xl font-bold font-mono ${totalProfit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
                </span>
                <span className="text-xs text-white/60 mt-1">
                  From all vault positions
                </span>
              </div>
              <div className={`h-10 w-10 rounded-full ${totalProfit >= 0 ? 'bg-emerald/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                <TrendingUp className={`h-5 w-5 ${totalProfit >= 0 ? 'text-emerald' : 'text-red-500'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Profile Card */}
      <motion.div variants={item}>
        <Card className="bg-black/30 border-white/[0.08] backdrop-blur-sm hover:bg-black/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start mb-3">
              <div className="flex flex-col flex-1">
                <span className="text-xs font-medium text-white/60 mb-1 flex items-center">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-white/60" />
                  Risk Profile
                </span>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium flex items-center px-2 py-1 rounded-full ${getRiskColor()}`}>
                    {getRiskIcon()}
                    {riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center">
                        <Percent className="h-3 w-3 mr-1 text-white/60" />
                        <span className="text-white/60">Capital deployed</span>
                      </div>
                      <span className={`font-medium ${getCapitalDeployedStatus()}`}>{capitalDeployed}%</span>
                    </div>

                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          capitalDeployed < 30 ? 'bg-emerald' :
                          capitalDeployed < 70 ? 'bg-orion' : 'bg-nova'
                        }`}
                        style={{ width: `${capitalDeployed}%` }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[250px]">
                  <p className="text-xs">
                    Percentage of your funds currently active in yield-generating positions.
                    Higher deployment can mean higher returns but with increased exposure.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
