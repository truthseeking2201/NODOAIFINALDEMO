
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  Landmark,
  LineChart,
  TrendingUp,
  Percent,
  ShieldCheck,
  AlertTriangle,
  Gauge
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VaultData } from "@/types/vault";
import { Badge } from "@/components/ui/badge";

interface VaultMetricsCardProps {
  vault: VaultData;
  styles: {
    gradientText: string;
    gradientBg: string;
    shadow: string;
  };
  projectedAmount: string;
  onProjectedAmountChange: (value: string) => void;
  isConnected: boolean;
  onActionClick: () => void;
}

export function VaultMetricsCard({
  vault,
  styles,
  projectedAmount,
  onProjectedAmountChange,
  isConnected,
  onActionClick
}: VaultMetricsCardProps) {
  const [sliderValue, setSliderValue] = useState<number[]>([projectedAmount ? parseInt(projectedAmount) : 1000]);
  const [sliderLabel, setSliderLabel] = useState<string>('');

  // Mock values for deposited and total profit
  const [depositedAmount] = useState(1250);
  const [totalProfit] = useState(74.32);

  // Mock data for capital deployment
  const [capitalDeployed] = useState(72); // Percentage of capital actively deployed

  useEffect(() => {
    if (sliderValue[0]) {
      onProjectedAmountChange(sliderValue[0].toString());
      setSliderLabel(`$${sliderValue[0].toLocaleString()}`);
    }
  }, [sliderValue, onProjectedAmountChange]);

  useEffect(() => {
    const value = projectedAmount ? parseInt(projectedAmount) : 1000;
    setSliderValue([value]);
    setSliderLabel(`$${value.toLocaleString()}`);
  }, [projectedAmount]);

  const formatPercentage = (value?: number) => {
    return value !== undefined ? `${value.toFixed(1)}%` : '-';
  };

  const formatCurrency = (value?: number) => {
    return value !== undefined ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value) : '-';
  };

  const formatCurrencyWithDecimals = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const calculateProjectedEarnings = (amount: string) => {
    if (!amount || !vault) return 0;
    const principal = parseFloat(amount);
    if (isNaN(principal)) return 0;
    return (principal * vault.apr / 100) / 12;
  };

  const getButtonProps = () => {
    if (!isConnected) {
      return {
        text: "Connect Wallet",
        icon: <Wallet className="ml-2 h-4 w-4" />,
        className: `w-full h-12 text-white transition-all hover:scale-[0.98] shadow-lg text-base font-semibold ${
          vault.type === 'nova'
            ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400'
            : vault.type === 'orion'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400'
              : 'bg-gradient-to-r from-emerald to-green-500 hover:from-emerald/90 hover:to-green-400'
        }`,
        variant: "default" as const
      };
    } else {
      return {
        text: "Deposit Now",
        icon: <ArrowRight className="ml-2 h-4 w-4" />,
        className: `w-full h-12 text-white transition-all hover:scale-[0.98] active:scale-95 shadow-lg text-base font-semibold ${
          vault.type === 'nova'
            ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400'
            : vault.type === 'orion'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400'
              : 'bg-gradient-to-r from-emerald to-green-500 hover:from-emerald/90 hover:to-green-400'
        }`,
        variant: "default" as const
      };
    }
  };

  const getRiskBadgeProps = () => {
    switch (vault.riskLevel) {
      case 'low':
        return {
          text: 'Low risk',
          icon: <ShieldCheck size={14} className="mr-1" />,
          className: 'bg-emerald/20 text-emerald hover:bg-emerald/30'
        };
      case 'medium':
        return {
          text: 'Medium risk',
          icon: <Gauge size={14} className="mr-1" />,
          className: 'bg-orion/20 text-orion hover:bg-orion/30'
        };
      case 'high':
        return {
          text: 'High risk',
          icon: <AlertTriangle size={14} className="mr-1" />,
          className: 'bg-nova/20 text-nova hover:bg-nova/30'
        };
      default:
        return {
          text: 'Moderate risk',
          icon: <Gauge size={14} className="mr-1" />,
          className: 'bg-orion/20 text-orion hover:bg-orion/30'
        };
    }
  };

  const buttonProps = getButtonProps();
  const riskBadgeProps = getRiskBadgeProps();

  return (
    <Card className="overflow-hidden rounded-xl border-0 relative">
      <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className={`p-2 rounded-lg ${
              vault.type === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
              vault.type === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
              'bg-gradient-to-br from-emerald/30 to-emerald/10'
            }`}>
              <TrendingUp size={20} className={
                vault.type === 'nova' ? 'text-nova' :
                vault.type === 'orion' ? 'text-orion' :
                'text-emerald'} />
            </div>
            <span>Vault Metrics</span>
          </CardTitle>
          <CardDescription className="text-sm text-white/60">
            Key performance indicators
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`px-2 py-1 text-xs font-medium flex items-center ${riskBadgeProps.className}`}
          >
            {riskBadgeProps.icon}
            {riskBadgeProps.text}
          </Badge>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="px-2 py-1 text-xs font-medium flex items-center bg-white/10 text-white hover:bg-white/20"
                >
                  <Percent size={14} className="mr-1" />
                  Capital deployed {capitalDeployed}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Percentage of vault funds actively deployed in yield-generating positions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Three headline metrics as requested */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <div className={`p-2 rounded-lg mb-2 ${
              vault.type === 'nova' ? 'bg-gradient-to-br from-nova/20 to-nova/5' :
              vault.type === 'orion' ? 'bg-gradient-to-br from-orion/20 to-orion/5' :
              'bg-gradient-to-br from-emerald/20 to-emerald/5'
            }`}>
              <Landmark size={18} className={
                vault.type === 'nova' ? 'text-nova' :
                vault.type === 'orion' ? 'text-orion' :
                'text-emerald'
              } />
            </div>
            <div className="text-[13px] text-white/60 font-medium">Deposited</div>
            <div className="font-mono font-bold text-white text-xl mt-1">
              {formatCurrency(depositedAmount)}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <div className={`p-2 rounded-lg mb-2 ${
              vault.type === 'nova' ? 'bg-gradient-to-br from-nova/20 to-nova/5' :
              vault.type === 'orion' ? 'bg-gradient-to-br from-orion/20 to-orion/5' :
              'bg-gradient-to-br from-emerald/20 to-emerald/5'
            }`}>
              <LineChart size={18} className={
                vault.type === 'nova' ? 'text-nova' :
                vault.type === 'orion' ? 'text-orion' :
                'text-emerald'
              } />
            </div>
            <div className="text-[13px] text-white/60 font-medium">Live APR</div>
            <div className="font-mono font-bold text-white text-xl mt-1">
              {formatPercentage(vault.apr)}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <div className={`p-2 rounded-lg mb-2 ${
              vault.type === 'nova' ? 'bg-gradient-to-br from-nova/20 to-nova/5' :
              vault.type === 'orion' ? 'bg-gradient-to-br from-orion/20 to-orion/5' :
              'bg-gradient-to-br from-emerald/20 to-emerald/5'
            }`}>
              <TrendingUp size={18} className={
                vault.type === 'nova' ? 'text-nova' :
                vault.type === 'orion' ? 'text-orion' :
                'text-emerald'
              } />
            </div>
            <div className="text-[13px] text-white/60 font-medium">Total Profit</div>
            <div className="font-mono font-bold text-emerald text-xl mt-1">
              {formatCurrencyWithDecimals(totalProfit)}
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="relative pt-10 pb-6">
            <div
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm shadow-md z-10 font-mono border border-white/10"
            >
              {sliderLabel}
            </div>

            <Slider
              value={sliderValue}
              min={100}
              max={10000}
              step={100}
              className={`[&_.relative]:h-[3px] [&_.absolute]:${
                vault.type === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                vault.type === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                'bg-gradient-to-r from-emerald to-green-500'
              } [&_button]:h-5 [&_button]:w-5 [&_button]:border [&_button]:border-white/40`}
              onValueChange={(value) => setSliderValue(value)}
            />

            <div className="flex justify-between items-center mt-4 text-center p-3 rounded-lg bg-white/10 border border-white/10">
              <div className="text-[13px] text-white/60 font-medium">Monthly Earnings</div>
              <div className="text-right text-lg font-mono font-semibold text-white/95">
                ${calculateProjectedEarnings(projectedAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <h3 className="text-sm text-white/60 font-medium">Lockup Periods</h3>
          <div className="grid grid-cols-3 gap-3">
            {vault.lockupPeriods.map((period) => (
              <button
                key={period.days}
                className={`
                  flex flex-col items-center justify-center py-3 px-2 rounded-lg
                  border border-white/10 transition-all hover:border-white/20
                  ${period.aprBoost > 0 ? 'bg-white/10' : 'bg-white/5'}
                `}
              >
                <span className={`text-base font-medium ${
                  period.aprBoost > 0 ? 'text-white' : 'text-white/80'
                }`}>
                  {period.days} days
                </span>
                <span className={`text-xs font-mono mt-1 ${
                  period.aprBoost > 0 ?
                  (vault.type === 'nova' ? 'text-nova' :
                   vault.type === 'orion' ? 'text-orion' :
                   'text-emerald') :
                  'text-white/60'
                }`}>
                  {period.aprBoost > 0 ? `+${period.aprBoost}%` : 'No boost'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          variant={buttonProps.variant}
          className={buttonProps.className}
          onClick={onActionClick}
        >
          {buttonProps.text} {buttonProps.icon}
        </Button>

        <div className="text-center text-xs font-mono text-white/60">
          Gas ≈ 0.006 SUI · Unlocks in 30 days
        </div>
      </CardContent>
    </Card>
  );
}
