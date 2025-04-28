import React, { useEffect, useState } from "react";
import { Brain, TrendingUp, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { StatChip } from "./StatChip";

export function EnhancedHeroSection() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    refetchOnWindowFocus: false,
  });

  const [kpiData, setKpiData] = useState({
    tvl: "$6.3M",
    apr: "18.7%",
    activeLPs: "2,000+"
  });

  useEffect(() => {
    if (isLoading || !vaults) return;

    // Calculate total TVL
    const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)}M`;

    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)}%`;

    // Simulate active LPs
    const activeLPs = "2,000+";

    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);

  return (
    <div className="relative pb-8">
      {/* Simple gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-nova/10 blur-[120px] opacity-50" />
        <div className="absolute -bottom-60 -right-60 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] opacity-40" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto text-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-5 flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nova to-amber-500 rounded-full blur-[15px] opacity-40 scale-125"></div>
            <div className="relative bg-gradient-to-br from-nova via-nova to-amber-500 p-4 rounded-full shadow-lg">
              <Brain size={32} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500">Smart Yield Vaults</span>
        </motion.h1>

        <motion.p
          className="text-white/70 text-xl max-w-[600px] mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Optimize your crypto returns with advanced technology
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-12 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="stat-item text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <DollarSign size={16} className="text-emerald" />
              <p className="text-white/50 text-sm">Total Value</p>
            </div>
            <p className="text-2xl font-bold text-white">{kpiData.tvl}</p>
          </div>

          <div className="stat-item text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <TrendingUp size={16} className="text-nova" />
              <p className="text-white/50 text-sm">Avg. APR</p>
            </div>
            <p className="text-2xl font-bold text-white">{kpiData.apr}</p>
          </div>

          <div className="stat-item text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Users size={16} className="text-orion" />
              <p className="text-white/50 text-sm">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-white">{kpiData.activeLPs}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
