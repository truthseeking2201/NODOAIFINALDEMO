import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Cpu,
  TrendingUp,
  ShieldCheck,
  BarChart4,
  Network,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon
} from "lucide-react";

interface AIMetricsPanelProps {
  vaultType: 'nova' | 'orion' | 'emerald';
}

interface AIMetric {
  name: string;
  value: number;
  change: number;
  icon: LucideIcon;
  description: string;
}

export function AIMetricsPanel({ vaultType }: AIMetricsPanelProps) {
  const [metrics, setMetrics] = useState<AIMetric[]>([]);
  const [lastOptimization, setLastOptimization] = useState<Date>(new Date(Date.now() - 1000 * 60 * 3)); // 3 minutes ago
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [processingPower, setProcessingPower] = useState<number>(78);
  const [showPulse, setShowPulse] = useState(false);

  const typeColors = {
    nova: {
      text: 'text-nova',
      bg: 'bg-nova',
      bgLight: 'bg-nova/20',
      border: 'border-nova/30',
      gradient: 'from-nova via-amber-500 to-orange-500'
    },
    orion: {
      text: 'text-orion',
      bg: 'bg-orion',
      bgLight: 'bg-orion/20',
      border: 'border-orion/30',
      gradient: 'from-orion via-yellow-500 to-amber-500'
    },
    emerald: {
      text: 'text-emerald',
      bg: 'bg-emerald',
      bgLight: 'bg-emerald/20',
      border: 'border-emerald/30',
      gradient: 'from-emerald via-green-500 to-teal-500'
    }
  };

  const colors = typeColors[vaultType];

  useEffect(() => {
    // Initialize metrics based on vault type
    const baseMetrics: AIMetric[] = [
      {
        name: "Optimization Score",
        value: vaultType === 'nova' ? 92 : vaultType === 'orion' ? 88 : 82,
        change: 3.2,
        icon: Brain,
        description: "Overall effectiveness of AI optimization strategies"
      },
      {
        name: "Risk Management",
        value: vaultType === 'nova' ? 76 : vaultType === 'orion' ? 85 : 94,
        change: vaultType === 'nova' ? -1.5 : 2.1,
        icon: ShieldCheck,
        description: "AI-driven risk assessment and mitigation"
      },
      {
        name: "Market Prediction",
        value: vaultType === 'nova' ? 88 : vaultType === 'orion' ? 82 : 78,
        change: 1.8,
        icon: TrendingUp,
        description: "Accuracy of price movement predictions"
      },
      {
        name: "Efficiency Score",
        value: vaultType === 'nova' ? 96 : vaultType === 'orion' ? 91 : 87,
        change: 0.5,
        icon: BarChart4,
        description: "Gas and transaction cost optimization"
      }
    ];

    setMetrics(baseMetrics);

    // Simulate periodic updates to the metrics
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.min(100, Math.max(0, metric.value + (Math.random() * 2 - 1) * 2)),
        change: parseFloat((metric.change + (Math.random() * 2 - 1) * 0.3).toFixed(1))
      })));

      // Update last optimization time occasionally
      if (Math.random() > 0.7) {
        setLastOptimization(new Date());
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 2000);

        // Update confidence score and processing power
        setConfidenceScore(prev => Math.min(99, Math.max(70, prev + (Math.random() * 6 - 2))));
        setProcessingPower(prev => Math.min(100, Math.max(50, prev + (Math.random() * 10 - 5))));
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [vaultType]);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 relative overflow-hidden">
      {/* Background neural pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="neural-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 40 M40 10 L10 40 M25 0 L25 50 M0 25 L50 25" stroke="white" strokeWidth="0.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-pattern)" />
        </svg>
      </div>

      {/* Header with neural animation */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${vaultType}/20 to-transparent flex items-center justify-center`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Cpu size={20} className={colors.text} />
              </motion.div>
            </div>
            <motion.div
              className={`absolute -inset-1 rounded-lg ${colors.border}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2, 1.4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 5
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Neural Optimization Metrics
              {showPulse && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-normal text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 border border-green-500/30"
                >
                  Updated
                </motion.div>
              )}
            </h2>
            <p className="text-sm text-white/60">
              Real-time AI performance indicators
            </p>
          </div>
        </div>

        {/* Last optimization time */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Network size={14} className={colors.text} />
            <span className="text-xs text-white/80">Last optimization: {timeAgo(lastOptimization)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} animate-pulse`}></div>
            <span className="text-xs text-white/60">AI active</span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg border border-white/10 p-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <metric.icon size={14} className={colors.text} />
                <h3 className="text-sm font-medium text-white">{metric.name}</h3>
              </div>
              <div className="flex items-center">
                {metric.change > 0 ? (
                  <ArrowUpRight size={12} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={12} className="text-red-500" />
                )}
                <span className={`text-xs font-mono ${
                  metric.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-mono font-semibold">{Math.round(metric.value)}</div>
              <div className="text-xs text-white/60">/ 100</div>
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  vaultType === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                  vaultType === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
                  'bg-gradient-to-r from-emerald to-green-500'
                }`}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <div className="mt-2 text-[10px] text-white/50">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* AI confidence score */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className={colors.text} />
            <h3 className="text-sm font-medium text-white">AI Confidence</h3>
          </div>

          <div className="relative h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <path
                d="M10,50 A40,40 0 0,1 90,50"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M10,50 A40,40 0 0,1 90,50"
                fill="none"
                stroke={
                  vaultType === 'nova' ? 'url(#gradient-nova)' :
                  vaultType === 'orion' ? 'url(#gradient-orion)' :
                  'url(#gradient-emerald)'
                }
                strokeDasharray="126"
                strokeDashoffset={126 - (126 * confidenceScore / 100)}
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-nova" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradient-orion" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-2xl font-mono font-bold"
                animate={{
                  scale: showPulse ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              >
                {Math.round(confidenceScore)}%
              </motion.div>
              <div className="text-xs text-white/60">Confidence</div>
            </div>
          </div>
        </div>

        {/* Processing power utilization */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className={colors.text} />
            <h3 className="text-sm font-medium text-white">Neural Processing</h3>
          </div>

          <div className="h-24 flex flex-col justify-between">
            <div className="flex-1 grid grid-cols-6 grid-rows-4 gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const isActive = (i / 24) * 100 < processingPower;
                return (
                  <motion.div
                    key={i}
                    className={`rounded-sm ${isActive ? colors.bgLight : 'bg-white/5'}`}
                    animate={{
                      opacity: isActive ? [0.5, 1, 0.5] : 0.3
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-white/60">Processing Units</div>
              <div className="text-sm font-mono font-semibold">{Math.round(processingPower)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert badge */}
      {vaultType === 'nova' && (
        <div className="mt-4 bg-nova/10 border border-nova/20 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-nova" />
          <span className="text-xs text-white/80">High risk mode: AI optimization prioritizing maximum yield</span>
        </div>
      )}

      {vaultType === 'orion' && (
        <div className="mt-4 bg-orion/10 border border-orion/20 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-orion" />
          <span className="text-xs text-white/80">Balanced mode: AI optimizing for yield and stability</span>
        </div>
      )}

      {vaultType === 'emerald' && (
        <div className="mt-4 bg-emerald/10 border border-emerald/20 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-emerald" />
          <span className="text-xs text-white/80">Conservative mode: AI prioritizing capital preservation</span>
        </div>
      )}
    </div>
  );
}

// Helper function to show time ago
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  if (seconds < 10) return "just now";

  return Math.floor(seconds) + " seconds ago";
}
