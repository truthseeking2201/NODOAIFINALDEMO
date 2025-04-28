import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

interface AIAction {
  action: string;
  result: string;
  timestamp: Date;
}

// Memoized components for better performance
const TickerIcon = memo(({ size }: { size: number }) => (
  <div className="relative flex-shrink-0">
    <Brain size={size} className="opacity-80" />
    <motion.div
      className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full"
      animate={{ scale: [1, 1.5, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />
  </div>
));

const PulseIcon = memo(() => (
  <motion.div
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="w-6 h-6 rounded-full bg-nova/10 flex items-center justify-center"
  >
    <Zap size={12} className="text-nova" />
  </motion.div>
));

export function NeuralActivityTicker() {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Generate simulated AI actions - memoized to avoid regenerating on each render
  useEffect(() => {
    const aiActions = [
      {
        action: "Optimizing liquidity position range",
        result: "+0.3% APR gain",
        timestamp: new Date(Date.now() - 35000)
      },
      {
        action: "Analyzing price volatility patterns",
        result: "Adjusted risk models",
        timestamp: new Date(Date.now() - 95000)
      },
      {
        action: "Rebalancing token exposure",
        result: "Mitigated impermanent loss",
        timestamp: new Date(Date.now() - 170000)
      },
      {
        action: "Monitoring market sentiment",
        result: "Updated position thresholds",
        timestamp: new Date(Date.now() - 320000)
      },
      {
        action: "Analyzing pool depth fluctuations",
        result: "Optimized fee capture",
        timestamp: new Date(Date.now() - 480000)
      }
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
    }, 3500);

    return () => clearInterval(interval);
  }, [actions.length, isPaused]);

  // Memoized formatter for time strings to avoid unnecessary recalculations
  const getTimeAgo = useCallback((date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, []);

  // Early return for empty state
  if (actions.length === 0) return null;

  // Current action to display
  const currentAction = actions[currentIndex];

  return (
    <div
      className="w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 h-12 px-4 flex items-center overflow-hidden">
        {/* Left section */}
        <div className="flex items-center space-x-2 text-nova">
          <TickerIcon size={18} />
          <div className="text-xs uppercase tracking-wider font-medium">NODO AI</div>
          <div className="h-5 w-px bg-white/10" />
        </div>

        {/* Middle section */}
        <div className="flex-1 relative overflow-hidden px-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between w-full text-sm"
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={14} className="text-nova" />
                <span className="text-white/80">{currentAction.action}</span>
                <span className="rounded-full px-2 py-0.5 bg-emerald/10 text-emerald text-xs font-medium">
                  {currentAction.result}
                </span>
              </div>
              <div className="text-white/50 text-xs font-mono">
                {getTimeAgo(currentAction.timestamp)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 pl-2">
          <div className="h-5 w-px bg-white/10" />
          <PulseIcon />
        </div>
      </div>
    </div>
  );
}
