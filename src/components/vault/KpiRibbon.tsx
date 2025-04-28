
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { StatChip } from "./StatChip";
import { TrendingUp, DollarSign, Users } from "lucide-react";

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

  return (
    <div className="flex justify-center items-center gap-16 py-10 mt-4 animate-fade-in">
      <div className="stat-item flex items-center gap-6">
        <div className="stat-icon bg-gradient-to-tr from-emerald/20 to-emerald/5 p-4 rounded-2xl">
          <DollarSign size={24} className="text-emerald" />
        </div>
        <StatChip
          label="Total TVL"
          value={kpiData.tvl}
          delta={{ value: 0.5 }}
        />
      </div>

      <div className="stat-item flex items-center gap-6">
        <div className="stat-icon bg-gradient-to-tr from-nova/20 to-nova/5 p-4 rounded-2xl">
          <TrendingUp size={24} className="text-nova" />
        </div>
        <StatChip
          label="Average APR"
          value={kpiData.apr}
          delta={{ value: 0.2 }}
        />
      </div>

      <div className="stat-item flex items-center gap-6">
        <div className="stat-icon bg-gradient-to-tr from-orion/20 to-orion/5 p-4 rounded-2xl">
          <Users size={24} className="text-orion" />
        </div>
        <StatChip
          label="Active LPs"
          value={kpiData.activeLPs}
          delta={{ value: 0.8 }}
        />
      </div>
    </div>
  );
}
