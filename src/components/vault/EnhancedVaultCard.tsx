import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Brain,
  ArrowRight,
  Zap,
  LockKeyhole,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VaultData } from "@/types/vault";
import { Progress } from "@/components/ui/progress";

interface VaultCardProps {
  vault: VaultData;
  isActive?: boolean;
  onHover?: (id: string) => void;
  isConnected?: boolean;
  balance?: { usdc: number };
}

export function EnhancedVaultCard({
  vault,
  isActive = false,
  onHover,
  isConnected = false,
  balance
}: VaultCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover(vault.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDepositClick = () => {
    navigate(`/vaults/${vault.id}`);
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return "bg-nova/10 text-nova border-nova/20";
      case 'medium': return "bg-orion/10 text-orion border-orion/20";
      case 'low':
      default: return "bg-emerald/10 text-emerald border-emerald/20";
    }
  };

  const getVaultTypeColor = (type: string) => {
    switch (type) {
      case 'nova': return "text-nova";
      case 'orion': return "text-orion";
      case 'emerald':
      default: return "text-emerald";
    }
  };

  const getAIProbability = () => {
    // Simulate different AI optimization levels based on vault type
    switch (vault.type) {
      case 'nova': return 98;
      case 'orion': return 94;
      case 'emerald': return 88;
    }
  };

  const aiOptimizationLevel = getAIProbability();

  // Background gradient based on vault type
  const getBgGradient = (type: string) => {
    switch (type) {
      case 'nova': return "from-nova/20 via-nova/5 to-transparent";
      case 'orion': return "from-orion/20 via-orion/5 to-transparent";
      case 'emerald': return "from-emerald/20 via-emerald/5 to-transparent";
      default: return "from-white/10 via-white/5 to-transparent";
    }
  };

  // Calculate a hypothetical returns value based on APR for display purposes
  const calculateHypotheticalReturns = (initialAmount: number) => {
    const monthlyRate = vault.apr / 100 / 12;
    const months = 12;
    const finalAmount = initialAmount * Math.pow(1 + monthlyRate, months);
    return finalAmount - initialAmount;
  };

  const hypotheticalInvestment = 10000; // $10,000 example investment
  const projectedReturns = calculateHypotheticalReturns(hypotheticalInvestment);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300
        ${isActive || isHovered ? 'border-white/20 shadow-lg shadow-black/20' : 'border-white/10'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        zIndex: isHovered ? 10 : 1
      }}
    >
      {/* Gradient background based on vault type */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getBgGradient(vault.type)} opacity-50`} />

      {/* Animated background elements for hover effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full blur-[80px] opacity-20"
          style={{
            background:
              vault.type === 'nova' ? 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(0,0,0,0) 70%)' :
              vault.type === 'orion' ? 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(0,0,0,0) 70%)' :
              'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0) 70%)'
          }}
        />
      </motion.div>

      {/* Main container */}
      <div className="relative bg-black/50 backdrop-blur-sm p-6 h-full flex flex-col">
        {/* Header with labels and risk badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              {/* Chip with AI indicator */}
              <div className={`relative px-2 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium bg-white/5 border border-white/10`}>
                <Brain size={11} className={getVaultTypeColor(vault.type)} />
                <span className="text-white/80">AI Boosted</span>
                <motion.div
                  className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${vault.type === 'nova' ? 'bg-nova' : vault.type === 'orion' ? 'bg-orion' : 'bg-emerald'}`}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              {/* Risk level badge */}
              <div className={`rounded-full px-2 py-1 border text-xs font-medium flex items-center gap-1 ${getRiskBadgeClass(vault.riskLevel)}`}>
                <Shield size={10} />
                <span className="capitalize">{vault.riskLevel} Risk</span>
              </div>
            </div>

            <h3 className={`text-xl font-bold ${getVaultTypeColor(vault.type)}`}>
              {vault.name}
            </h3>
          </div>

          {/* APR display with animation */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-white/60 mb-1">APR</div>
            <motion.div
              className="text-2xl font-bold font-mono text-white"
              animate={{
                opacity: isHovered ? [0.8, 1, 0.8] : 1
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0
              }}
            >
              {vault.apr.toFixed(1)}%
            </motion.div>
          </div>
        </div>

        {/* Strategy description */}
        <p className="text-white/70 text-sm mb-4 flex-grow">
          {vault.description}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* TVL Stat */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex justify-between items-start mb-1">
              <div className="text-xs text-white/60">Total Value Locked</div>
              <Users size={12} className="text-white/40" />
            </div>
            <div className="text-base font-mono font-medium">
              ${(vault.tvl / 1000000).toFixed(2)}M
            </div>
          </div>

          {/* Period Stat */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex justify-between items-start mb-1">
              <div className="text-xs text-white/60">Lock Period</div>
              <Clock size={12} className="text-white/40" />
            </div>
            <div className="text-base font-mono font-medium flex items-center">
              {vault.lockupPeriods[0]?.days || 30} Days
              <LockKeyhole size={12} className="ml-1 text-white/60" />
            </div>
          </div>
        </div>

        {/* AI Optimization visualization */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-xs text-white/60 flex items-center gap-1.5">
              <Sparkles size={10} className={getVaultTypeColor(vault.type)} />
              <span>AI Magic Level</span>
            </div>
            <div className="text-xs font-medium flex items-center gap-1">
              <span className={`${getVaultTypeColor(vault.type)}`}>{aiOptimizationLevel}%</span>
              <BarChart3 size={10} className="text-white/40" />
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                vault.type === 'nova'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500'
                  : vault.type === 'orion'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-emerald to-emerald/70'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${aiOptimizationLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Projected returns for example $10k investment */}
        <motion.div
          className="mb-6 bg-black/30 border border-white/10 rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
            <TrendingUp size={10} className={getVaultTypeColor(vault.type)} />
            <span>Your $10K could earn this in a year! 🚀</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-base font-mono font-medium text-white">
              ${Math.round(projectedReturns).toLocaleString()}
            </div>
            <div className="text-xs text-white/60">
              +{vault.apr.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <Button
          className={`w-full ${
            vault.type === 'nova'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400'
              : vault.type === 'orion'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400'
                : 'bg-gradient-to-r from-emerald to-green-500 hover:from-emerald/90 hover:to-green-400'
          } text-white shadow-lg flex items-center justify-center space-x-2 group`}
          onClick={handleDepositClick}
        >
          <Zap size={16} className="group-hover:animate-pulse" />
          <span>Deposit Now</span>
          <motion.div
            animate={{ x: isHovered ? [0, 4, 0] : 0 }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
          >
            <ArrowRight size={16} className="transition-transform" />
          </motion.div>
        </Button>
      </div>
    </motion.div>
  );
}
