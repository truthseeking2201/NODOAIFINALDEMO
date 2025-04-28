
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { StatChip } from "./StatChip";
import { TrendingUp, DollarSign, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function KpiRibbon() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    refetchOnWindowFocus: false,
  });

  const [kpiData, setKpiData] = useState({
    tvl: "$0.0 M",
    apr: "0.0 %",
    activeLPs: "0"
  });

  useEffect(() => {
    if (isLoading || !vaults) return;

    // Calculate total TVL
    const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)}M`;

    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)}%`;

    // Simulate active LPs (would come from real data in production)
    const activeLPs = "2,000+";

    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);

  // Animation variants for staggered animations
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
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="flex flex-wrap justify-center items-center gap-10 md:gap-12 py-6 px-2 animate-fade-in"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="stat-item flex items-center gap-4" variants={item}>
        <div className="stat-icon bg-gradient-to-tr from-emerald/30 to-emerald/5 p-3 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <DollarSign size={20} className="text-emerald" />
        </div>
        <StatChip
          label="Total TVL"
          value={kpiData.tvl}
          delta={{ value: 0.5 }}
        />
      </motion.div>

      <motion.div className="stat-item flex items-center gap-4" variants={item}>
        <div className="stat-icon bg-gradient-to-tr from-nova/30 to-nova/5 p-3 rounded-xl shadow-[0_0_10px_rgba(120,80,255,0.2)]">
          <TrendingUp size={20} className="text-nova" />
        </div>
        <StatChip
          label="Average APR"
          value={kpiData.apr}
          delta={{ value: 0.2 }}
        />
      </motion.div>

      <motion.div className="stat-item flex items-center gap-4" variants={item}>
        <div className="stat-icon bg-gradient-to-tr from-orion/30 to-orion/5 p-3 rounded-xl shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          <Users size={20} className="text-orion" />
        </div>
        <StatChip
          label="Active LPs"
          value={kpiData.activeLPs}
          delta={{ value: 0.8 }}
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-nova/20 to-emerald/20 h-0.5 w-20 rounded-full opacity-40"></div>
      </motion.div>
    </motion.div>
  );
}
