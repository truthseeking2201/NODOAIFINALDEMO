import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { VaultData } from "@/types/vault";
import { AIRebalancingTicker } from "./AIRebalancingTicker";
import { EnhancedPerformanceChart } from "./EnhancedPerformanceChart";

interface VaultPerformanceSectionProps {
  vault: VaultData;
  timeRange: "daily" | "weekly" | "monthly";
  onTimeRangeChange: (range: "daily" | "weekly" | "monthly") => void;
  styles: {
    gradientBg: string;
  };
}

export function VaultPerformanceSection({
  vault,
  timeRange,
  onTimeRangeChange,
  styles
}: VaultPerformanceSectionProps) {
  return (
    <div className="relative">
      {/* Enhanced performance chart with built-in time range selectors */}
      <EnhancedPerformanceChart
        vaultType={vault.type}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />

      {/* Add AI Rebalancing Ticker */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <AIRebalancingTicker variant="detail" vaultId={vault.id} />
      </div>
    </div>
  );
}
