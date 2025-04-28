import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Brain,
  PieChart,
  ArrowRight,
  BarChart3,
  Cpu,
  Zap,
  LucideIcon,
  X
} from "lucide-react";

interface AIPerformanceInsightsProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  apr: number;
  onClose?: () => void;
}

interface InsightData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  description: string;
}

export function AIPerformanceInsights({
  vaultType,
  apr,
  onClose
}: AIPerformanceInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [aiContribution, setAiContribution] = useState(0);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const getVaultTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        bgGradient: 'from-nova/20 via-nova/10 to-transparent',
        border: 'border-nova/20',
        highlight: 'bg-nova',
        chartColor: 'rgba(249, 115, 22, 0.8)'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        bgGradient: 'from-orion/20 via-orion/10 to-transparent',
        border: 'border-orion/20',
        highlight: 'bg-orion',
        chartColor: 'rgba(245, 158, 11, 0.8)'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        bgGradient: 'from-emerald/20 via-emerald/10 to-transparent',
        border: 'border-emerald/20',
        highlight: 'bg-emerald',
        chartColor: 'rgba(16, 185, 129, 0.8)'
      };
    }
  };

  const colors = getVaultTypeColor();

  // Initialize and set up insights data
  useEffect(() => {
    // Calculate AI contribution based on vault type
    const baseContribution = vaultType === 'nova' ? 45 : vaultType === 'orion' ? 38 : 32;
    setAiContribution(baseContribution);

    // Create insights relevant to each vault type
    const insightsData: InsightData[] = [
      {
        id: "ai-optimization",
        title: "Smart Investing",
        value: `+${(apr * (baseContribution / 100)).toFixed(1)}%`,
        change: `+${(Math.random() * 2 + 0.5).toFixed(1)}%`,
        isPositive: true,
        icon: Brain,
        description: "Our AI constantly watches the markets to find the best opportunities for your money, making adjustments that human managers might miss."
      },
      {
        id: "slippage-reduction",
        title: "Price Protection",
        value: vaultType === 'nova' ? "68%" : vaultType === 'orion' ? "72%" : "78%",
        change: `+${(Math.random() * 3 + 1).toFixed(1)}%`,
        isPositive: true,
        icon: BarChart3,
        description: "When buying or selling, our system times the market perfectly to make sure you get the best price possible without overpaying."
      },
      {
        id: "gas-optimization",
        title: "Fee Savings",
        value: `${(Math.random() * 15 + 20).toFixed(1)}%`,
        change: `-${(Math.random() * 3 + 2).toFixed(1)}%`,
        isPositive: true,
        icon: Zap,
        description: "Our AI bundles transactions together and picks the right timing to cut down on fees, saving you money while managing your investment."
      },
      {
        id: "computational-power",
        title: "AI Power",
        value: vaultType === 'nova' ? "128 TPU" : vaultType === 'orion' ? "96 TPU" : "64 TPU",
        change: `+${Math.floor(Math.random() * 8 + 8)}`,
        isPositive: true,
        icon: Cpu,
        description: "We use powerful computers dedicated just to making your investment grow. The more computing power, the smarter the investment decisions."
      }
    ];

    setInsights(insightsData);

    // Auto-rotate through insights
    const interval = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * insightsData.length);
      setAnimatingIndex(nextIndex);

      setTimeout(() => {
        setAnimatingIndex(null);
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, [vaultType, apr]);

  // Simple data for the comparison chart
  const performanceData = [
    { name: "Standard", value: apr - (apr * aiContribution / 100) },
    { name: "With AI", value: apr }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bgGradient}`}>
          <PieChart size={18} className={colors.primary} />
        </div>
        <h3 className="text-lg font-medium text-white">How AI Boosts Your Returns</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close insights panel"
          >
            <X size={16} className="text-white/60 hover:text-white/90" />
          </button>
        )}
      </div>

      {/* Comparative APR section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">Basic Interest Rate</span>
          <span className="text-sm font-mono">{(apr - (apr * aiContribution / 100)).toFixed(2)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-white/30"
            style={{ width: `${100 - aiContribution}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Your AI-Boosted Rate</span>
            <div className={`px-1.5 py-0.5 rounded-full text-xs ${colors.bg} ${colors.primary} flex items-center gap-1`}>
              <Brain size={10} />
              <span>+{aiContribution}%</span>
            </div>
          </div>
          <span className="text-sm font-mono font-medium">{apr.toFixed(2)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${
              vaultType === 'nova' ? 'from-nova/70 to-amber-500/70' :
              vaultType === 'orion' ? 'from-orion/70 to-yellow-500/70' :
              'from-emerald/70 to-green-500/70'
            }`}
            style={{ width: '100%' }}
          />
        </div>

        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
          <div className="flex items-start gap-2">
            <Brain size={14} className={colors.primary} />
            <span>
              Our smart AI system is adding <span className={colors.primary}>+{aiContribution}%</span> extra interest to your money compared to regular savings options.
            </span>
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className={`p-3 rounded-lg border relative overflow-hidden cursor-pointer ${
              selectedInsight === insight.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
            }`}
            onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
            animate={animatingIndex === index ? {
              backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']
            } : {}}
            transition={{ duration: 2 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <insight.icon size={14} className={colors.primary} />
                <h4 className="text-sm font-medium text-white">{insight.title}</h4>
              </div>
              <div className={`flex items-center text-xs ${insight.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowRight size={10} className={insight.isPositive ? 'rotate-45' : 'rotate-135'} />
                {insight.change}
              </div>
            </div>

            <div className="mt-1 text-lg font-mono font-medium">
              {insight.value}
            </div>

            <AnimatePresence>
              {selectedInsight === insight.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-xs text-white/70 overflow-hidden"
                >
                  {insight.description}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Performance visualization */}
      <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/5 relative h-32">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 0 20 M 0 0 L 20 0" stroke="white" strokeWidth="0.5" fill="none" strokeOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative h-full flex items-end gap-1 p-2">
          {/* Traditional strategy bar */}
          <div className="flex-1 flex flex-col items-center">
            <div
              className="w-full max-w-md bg-white/20 rounded-t-sm"
              style={{ height: `${(performanceData[0].value / apr) * 70}%` }}
            >
              <div className="h-full w-full opacity-20 bg-stripes-white" />
            </div>
            <div className="mt-2 text-xs text-white/60">Standard Rate</div>
            <div className="text-xs font-mono mt-0.5">{performanceData[0].value.toFixed(1)}%</div>
          </div>

          {/* AI-Enhanced strategy bar */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-md rounded-t-sm overflow-hidden flex flex-col-reverse" style={{ height: '70%' }}>
              <div
                className={`w-full rounded-t-sm ${colors.highlight}`}
                style={{ height: `${(aiContribution / 100) * 100}%` }}
              />
              <div
                className="w-full bg-white/20"
                style={{ height: `${100 - (aiContribution / 100) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-white/60">AI-Boosted Rate</div>
            <div className="text-xs font-mono mt-0.5 font-medium">{performanceData[1].value.toFixed(1)}%</div>
          </div>

          {/* Animated pulse to highlight AI contribution */}
          <div
            className="absolute left-0 right-0"
            style={{
              bottom: `${(aiContribution / 100) * 70 + 15}%`,
              height: '1px'
            }}
          >
            <motion.div
              className={`h-px ${colors.primary} w-full opacity-70`}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute right-0 -top-3 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px]">
              <span className={colors.primary}>+{aiContribution}%</span> AI Boost
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
