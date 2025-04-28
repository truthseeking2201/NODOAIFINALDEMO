import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Zap, BarChart2, RefreshCw, Shield, Clock, ArrowRight } from "lucide-react";

interface AIAction {
  action: string;
  result: string;
  timestamp: Date;
  type: 'optimize' | 'analyze' | 'rebalance' | 'monitor' | 'protect';
}

// Custom TrendingUp icon component
const TrendingUp = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export function EnhancedNeuralActivityTicker() {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate simulated AI actions
  useEffect(() => {
    const aiActions: AIAction[] = [
      {
        type: 'optimize',
        action: "Optimizing liquidity position range",
        result: "+0.3% APR gain",
        timestamp: new Date(Date.now() - 35000)
      },
      {
        type: 'analyze',
        action: "Analyzing price volatility patterns",
        result: "Adjusted risk models",
        timestamp: new Date(Date.now() - 95000)
      },
      {
        type: 'rebalance',
        action: "Rebalancing token exposure ratios",
        result: "Mitigated impermanent loss by 0.4%",
        timestamp: new Date(Date.now() - 170000)
      },
      {
        type: 'monitor',
        action: "Monitoring market sentiment signals",
        result: "Updated position thresholds",
        timestamp: new Date(Date.now() - 320000)
      },
      {
        type: 'protect',
        action: "Implementing volatility safeguards",
        result: "Protected against -2.1% drawdown",
        timestamp: new Date(Date.now() - 480000)
      },
      {
        type: 'optimize',
        action: "Adjusting concentrated liquidity bounds",
        result: "Fee capture improved by 0.2%",
        timestamp: new Date(Date.now() - 520000)
      },
      {
        type: 'analyze',
        action: "Processing on-chain oracle data",
        result: "Enhanced price prediction accuracy",
        timestamp: new Date(Date.now() - 610000)
      },
    ];

    setActions(aiActions);
  }, []);

  // Auto-rotate the actions
  useEffect(() => {
    if (actions.length === 0) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prev => (prev + 1) % actions.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [actions.length, isPaused]);

  // Create pulse effect when new activity appears
  useEffect(() => {
    if (containerRef.current && !isPaused) {
      containerRef.current.classList.add('pulse-highlight');
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove('pulse-highlight');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused]);

  if (actions.length === 0) return null;

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'optimize': return <TrendingUp size={16} className="text-nova" />;
      case 'analyze': return <BarChart2 size={16} className="text-orion" />;
      case 'rebalance': return <RefreshCw size={16} className="text-emerald" />;
      case 'monitor': return <Clock size={16} className="text-blue-400" />;
      case 'protect': return <Shield size={16} className="text-purple-400" />;
      default: return <Sparkles size={16} className="text-nova" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'optimize': return 'OPTIMIZATION';
      case 'analyze': return 'ANALYSIS';
      case 'rebalance': return 'REBALANCING';
      case 'monitor': return 'MONITORING';
      case 'protect': return 'PROTECTION';
      default: return 'ACTION';
    }
  };

  const getResultClass = (type: string) => {
    switch (type) {
      case 'optimize': return 'bg-nova/10 text-nova border-nova/20';
      case 'analyze': return 'bg-orion/10 text-orion border-orion/20';
      case 'rebalance': return 'bg-emerald/10 text-emerald border-emerald/20';
      case 'monitor': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'protect': return 'bg-purple-400/10 text-purple-400 border-purple-400/20';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto transition-all duration-300 ease-out group z-10 relative"
      onMouseEnter={() => {
        setIsPaused(true);
        setShowDetails(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setShowDetails(false);
      }}
    >
      <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-md rounded-xl border border-nova/20 overflow-hidden shadow-[0_0_15px_rgba(255,136,0,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,136,0,0.3)]">
        <div className="relative">
          {/* Ticker animation trails */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-70">
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-nova/80 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-nova/50 to-transparent"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          </div>

          <div className="px-4 py-3 flex items-center">
            <div className="flex items-center space-x-3 mr-4">
              <div className="relative flex-shrink-0 bg-gradient-to-br from-nova/30 to-nova/5 p-2 rounded-lg">
                <Brain size={18} className="text-nova" />
                <motion.div
                  className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-xs uppercase tracking-wider font-medium text-white">NODO AI</div>
                <div className="text-[10px] text-white/50">Neural Activity</div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
            </div>

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between w-full text-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 overflow-hidden mr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-white/40 hidden sm:inline">{getTimeAgo(actions[currentIndex].timestamp)}</span>
                      <span className="bg-white/5 text-white/60 text-[10px] font-medium rounded-full px-2 py-0.5 border border-white/10 hidden sm:inline">
                        {getTypeLabel(actions[currentIndex].type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {getActionIcon(actions[currentIndex].type)}
                      <span className="text-white/90 truncate">{actions[currentIndex].action}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${getResultClass(actions[currentIndex].type)}`}>
                      {actions[currentIndex].result}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3 ml-4">
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                  scale: { duration: 1.5, repeat: Infinity },
                  rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-nova/20 to-nova/5 flex items-center justify-center"
              >
                <Zap size={16} className="text-nova" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
                  <div className="px-4 py-2 text-sm">
                    <div className="text-xs text-white/50 mb-2">Recent AI Activities</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                      {actions.map((action, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between py-1 px-2 rounded ${idx === currentIndex ? 'bg-white/5' : ''}`}
                        >
                          <div className="flex items-center space-x-2">
                            {getActionIcon(action.type)}
                            <span className="text-white/70 text-xs">{action.action}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getResultClass(action.type)}`}>
                              {action.result}
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">{getTimeAgo(action.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end px-4 py-2 border-t border-white/5">
                    <button className="flex items-center text-xs text-nova hover:text-nova/80 transition-colors">
                      <span>View All Activity</span>
                      <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add a custom style for the pulse animation */}
      <style jsx>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
        .pulse-highlight {
          animation: pulse-border 1s ease-out;
        }
      `}</style>
    </div>
  );
}
