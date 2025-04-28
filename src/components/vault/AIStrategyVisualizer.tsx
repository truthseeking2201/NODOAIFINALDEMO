import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  LineChart,
  TrendingUp,
  ArrowRight,
  Settings,
  Brain,
  Zap,
  Lock,
  RefreshCw,
  ShieldCheck,
  BarChart4
} from "lucide-react";

interface AIStrategyVisualizerProps {
  vaultType: 'nova' | 'orion' | 'emerald';
}

interface Strategy {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'optimizing';
  allocation: number;
  optimizationScore: number;
  lastUpdated: Date;
  change: number;
  icon: React.ReactNode;
}

export function AIStrategyVisualizer({ vaultType }: AIStrategyVisualizerProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<number | null>(null);
  const [aiOptimizingIndex, setAiOptimizingIndex] = useState<number | null>(null);
  const [showPulse, setShowPulse] = useState(false);

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondaryText: 'text-amber-500',
        bg: 'bg-nova/10',
        border: 'border-nova/20',
        gradient: 'from-nova via-amber-500 to-orange-500',
        fillPrimary: 'bg-nova',
        fillSecondary: 'bg-amber-500'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondaryText: 'text-yellow-500',
        bg: 'bg-orion/10',
        border: 'border-orion/20',
        gradient: 'from-orion via-yellow-500 to-amber-500',
        fillPrimary: 'bg-orion',
        fillSecondary: 'bg-yellow-500'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondaryText: 'text-green-500',
        bg: 'bg-emerald/10',
        border: 'border-emerald/20',
        gradient: 'from-emerald via-green-500 to-teal-500',
        fillPrimary: 'bg-emerald',
        fillSecondary: 'bg-green-500'
      };
    }
  };

  const colors = getTypeColor();

  useEffect(() => {
    // Initialize strategies based on vault type
    const baseStrategies: Strategy[] = [];

    if (vaultType === 'nova') {
      baseStrategies.push(
        {
          id: 1,
          name: "Aggressive Liquidity Mining",
          description: "Maximizes yield by focusing on high-APR liquidity pools with active AI risk management",
          status: 'active',
          allocation: 55,
          optimizationScore: 93,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 15),
          change: 2.4,
          icon: <TrendingUp size={16} className={colors.primary} />
        },
        {
          id: 2,
          name: "Price Action Optimization",
          description: "Neural network predicts short-term token price movements to capture value",
          status: 'active',
          allocation: 25,
          optimizationScore: 87,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
          change: 1.1,
          icon: <LineChart size={16} className={colors.primary} />
        },
        {
          id: 3,
          name: "Arbitrage Detection",
          description: "AI identifies and exploits price differences across DEXs",
          status: 'active',
          allocation: 20,
          optimizationScore: 90,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 5),
          change: 0.8,
          icon: <RefreshCw size={16} className={colors.primary} />
        }
      );
    } else if (vaultType === 'orion') {
      baseStrategies.push(
        {
          id: 1,
          name: "Balanced Liquidity Provision",
          description: "AI-optimized liquidity positions balancing yield and stability",
          status: 'active',
          allocation: 45,
          optimizationScore: 88,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 10),
          change: 1.3,
          icon: <BarChart4 size={16} className={colors.primary} />
        },
        {
          id: 2,
          name: "Volatility Harvesting",
          description: "Captures value from market volatility while protecting principal",
          status: 'active',
          allocation: 30,
          optimizationScore: 85,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 22),
          change: 0.7,
          icon: <TrendingUp size={16} className={colors.primary} />
        },
        {
          id: 3,
          name: "Neural Risk Management",
          description: "AI constantly monitors market conditions to adjust risk parameters",
          status: 'active',
          allocation: 25,
          optimizationScore: 91,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 8),
          change: 1.5,
          icon: <ShieldCheck size={16} className={colors.primary} />
        }
      );
    } else {
      baseStrategies.push(
        {
          id: 1,
          name: "Conservative Yield Optimization",
          description: "Focus on stable yields with minimal impermanent loss risk",
          status: 'active',
          allocation: 50,
          optimizationScore: 92,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 18),
          change: 0.4,
          icon: <Lock size={16} className={colors.primary} />
        },
        {
          id: 2,
          name: "Stablecoin Strategy",
          description: "AI-managed stablecoin positions to maximize secure yield",
          status: 'active',
          allocation: 35,
          optimizationScore: 89,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 25),
          change: 0.2,
          icon: <ShieldCheck size={16} className={colors.primary} />
        },
        {
          id: 3,
          name: "Low Volatility Pairs",
          description: "AI selects token pairs with strong correlation to minimize IL",
          status: 'active',
          allocation: 15,
          optimizationScore: 86,
          lastUpdated: new Date(Date.now() - 1000 * 60 * 12),
          change: 0.5,
          icon: <BarChart4 size={16} className={colors.primary} />
        }
      );
    }

    setStrategies(baseStrategies);

    // Simulate strategy updates
    const interval = setInterval(() => {
      // Random strategy optimization
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * baseStrategies.length);
        setAiOptimizingIndex(randomIndex);
        setShowPulse(true);

        setTimeout(() => {
          setAiOptimizingIndex(null);
          setStrategies(prev => {
            return prev.map((strategy, idx) => {
              if (idx === randomIndex) {
                const optimizationChange = (Math.random() * 4 - 1);
                const allocationChange = Math.round((Math.random() * 10 - 3));

                // Ensure total allocation remains 100%
                let newAllocation = strategy.allocation + allocationChange;
                const otherStrategies = [...prev];
                otherStrategies.splice(randomIndex, 1);

                const totalOtherAllocation = otherStrategies.reduce((sum, s) => sum + s.allocation, 0);
                const adjustmentNeeded = 100 - (totalOtherAllocation + newAllocation);

                if (adjustmentNeeded !== 0) {
                  newAllocation += adjustmentNeeded;
                }

                return {
                  ...strategy,
                  status: 'active',
                  optimizationScore: Math.min(99, Math.max(70, strategy.optimizationScore + optimizationChange)),
                  allocation: newAllocation,
                  lastUpdated: new Date(),
                  change: parseFloat((strategy.change + (Math.random() * 0.6 - 0.2)).toFixed(1))
                };
              }
              return strategy;
            });
          });
        }, 3000);
      }

      // Occasionally show a strategy as optimizing
      if (Math.random() > 0.85 && aiOptimizingIndex === null) {
        const randomIndex = Math.floor(Math.random() * baseStrategies.length);
        setStrategies(prev => {
          return prev.map((strategy, idx) => {
            if (idx === randomIndex) {
              return {
                ...strategy,
                status: 'optimizing'
              };
            }
            return strategy;
          });
        });

        // Reset after a few seconds
        setTimeout(() => {
          setStrategies(prev => {
            return prev.map((strategy, idx) => {
              if (idx === randomIndex) {
                return {
                  ...strategy,
                  status: 'active',
                  optimizationScore: Math.min(99, Math.max(70, strategy.optimizationScore + (Math.random() * 3))),
                  lastUpdated: new Date()
                };
              }
              return strategy;
            });
          });
        }, 5000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [vaultType]);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 relative overflow-hidden">
      {/* AI network background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ai-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#ai-grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-5">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg}`}>
          <Lightbulb size={18} className={colors.primary} />
        </div>
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            AI Strategy Breakdown
            {showPulse && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"
              >
                Optimized
              </motion.div>
            )}
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Neural network allocation and monitoring
          </p>
        </div>
      </div>

      {/* Strategies */}
      <div className="space-y-4">
        <AnimatePresence>
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              className={`
                rounded-lg border p-3 transition-colors relative overflow-hidden
                ${activeStrategy === strategy.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}
                ${aiOptimizingIndex === index ? `${colors.bg} ${colors.border}` : ''}
              `}
              onClick={() => setActiveStrategy(strategy.id === activeStrategy ? null : strategy.id)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {/* Optimization Indicator */}
              {aiOptimizingIndex === index && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain size={24} className={colors.primary} />
                    </motion.div>
                    <div className="text-sm font-medium mt-2 text-white">Optimizing Strategy</div>
                    <div className="text-xs text-white/60 mt-1">Analyzing market data...</div>
                  </div>
                </motion.div>
              )}

              {/* Strategy Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-white/10`}>
                    {strategy.icon}
                  </div>
                  <h4 className="text-sm font-medium text-white pr-4">{strategy.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  {strategy.status === 'active' && (
                    <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Active
                    </div>
                  )}

                  {strategy.status === 'optimizing' && (
                    <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1">
                      <Settings size={10} className="animate-spin" />
                      Optimizing
                    </div>
                  )}

                  {strategy.status === 'pending' && (
                    <div className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                      Pending
                    </div>
                  )}
                </div>
              </div>

              {/* Strategy Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-white/60 mb-1">Allocation</div>
                  <div className="text-base font-mono font-medium">{strategy.allocation}%</div>
                </div>

                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-white/60 mb-1">AI Score</div>
                  <div className="text-base font-mono font-medium flex items-center gap-1">
                    {Math.round(strategy.optimizationScore)}
                    <div className="text-xs text-green-500 flex items-center">
                      <ArrowRight size={10} className="rotate-45" />
                      {strategy.change > 0 ? '+' : ''}{strategy.change}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-white/60 mb-1">Updated</div>
                  <div className="text-base font-mono font-medium">{timeAgo(strategy.lastUpdated)}</div>
                </div>
              </div>

              {/* Strategy Description with expansion */}
              <AnimatePresence>
                {activeStrategy === strategy.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="text-sm text-white/80 mb-3">{strategy.description}</div>

                    {/* Optimization visualization */}
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-white/60">Neural Optimization Pattern</div>
                        <div className="flex items-center gap-1">
                          <Brain size={12} className={colors.primary} />
                          <span className="text-xs font-mono">{Math.round(strategy.optimizationScore)}%</span>
                        </div>
                      </div>

                      {/* Neural pattern visualization */}
                      <div className="h-10 bg-black/40 rounded-md overflow-hidden relative">
                        {/* Optimized wave pattern */}
                        <svg viewBox="0 0 200 50" className="w-full h-full absolute inset-0">
                          <defs>
                            <linearGradient id={`gradient-${strategy.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={
                                vaultType === 'nova' ? '#f97316' :
                                vaultType === 'orion' ? '#f59e0b' :
                                '#10b981'
                              } stopOpacity="0.7" />
                              <stop offset="100%" stopColor={
                                vaultType === 'nova' ? '#f59e0b' :
                                vaultType === 'orion' ? '#eab308' :
                                '#22c55e'
                              } stopOpacity="0.7" />
                            </linearGradient>
                          </defs>
                          <path
                            d={`M0,25 ${Array.from({ length: 10 }).map((_, i) => {
                              const x1 = i * 20;
                              const y1 = 25 + (Math.sin(i * 0.5) * 15);
                              const x2 = i * 20 + 10;
                              const y2 = 25 + (Math.cos(i * 0.5) * 15);
                              return `L${x1},${y1} L${x2},${y2}`;
                            }).join(' ')} L200,25`}
                            fill="none"
                            stroke={`url(#gradient-${strategy.id})`}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          {/* Neural nodes */}
                          {Array.from({ length: 5 }).map((_, i) => (
                            <circle
                              key={i}
                              cx={i * 40 + 20}
                              cy={25 + (Math.sin(i * 0.5) * 15)}
                              r="3"
                              fill={
                                vaultType === 'nova' ? '#f97316' :
                                vaultType === 'orion' ? '#f59e0b' :
                                '#10b981'
                              }
                              opacity="0.9"
                            />
                          ))}
                        </svg>

                        {/* AI Optimization Line */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r"
                          style={{
                            backgroundImage: `linear-gradient(90deg, transparent, ${
                              vaultType === 'nova' ? 'rgba(249, 115, 22, 0.3)' :
                              vaultType === 'orion' ? 'rgba(245, 158, 11, 0.3)' :
                              'rgba(16, 185, 129, 0.3)'
                            })`
                          }}
                          animate={{
                            opacity: [0, 0.5, 0],
                            x: [-100, 300]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand/collapse indicator */}
              <div className="flex justify-center mt-2">
                <motion.div
                  className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center"
                  animate={{ rotate: activeStrategy === strategy.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight
                    size={14}
                    className={`text-white/40 transform rotate-90`}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AI Strategy Distribution visualization */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">AI Capital Allocation</h4>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className={colors.primary} />
            <span className="text-xs text-white/70">Adaptive</span>
          </div>
        </div>

        <div className="h-6 bg-white/5 rounded-lg overflow-hidden flex">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              className={`h-full relative ${
                index === 0 ? colors.fillPrimary :
                index === 1 ? colors.fillSecondary :
                'bg-white/20'
              }`}
              style={{ width: `${strategy.allocation}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${strategy.allocation}%` }}
              transition={{ duration: 1 }}
            >
              {/* Strategy divider lines */}
              {index > 0 && (
                <div className="absolute inset-y-0 -left-px w-px bg-black/20"></div>
              )}

              {/* Strategy label */}
              {strategy.allocation >= 15 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {Math.round(strategy.allocation)}%
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {strategies.map((strategy, index) => (
            <div key={strategy.id} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${
                index === 0 ? colors.fillPrimary :
                index === 1 ? colors.fillSecondary :
                'bg-white/20'
              }`}></div>
              <span className="text-xs text-white/70 truncate">{strategy.name.split(' ').slice(0, 2).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to show time ago
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  if (seconds < 10) return "just now";

  return Math.floor(seconds) + "s ago";
}
