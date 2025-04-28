import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

interface AIAction {
  action: string;
  result: string;
  timestamp: Date;
}

export function NeuralActivityTicker() {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Generate simulated AI actions
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

  return (
    <div 
      className="w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 h-12 px-4 flex items-center overflow-hidden">
        <div className="flex items-center space-x-2 text-nova">
          <div className="relative flex-shrink-0">
            <Brain size={18} className="opacity-80" />
            <motion.div 
              className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full" 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          <div className="text-xs uppercase tracking-wider font-medium">NODO AI</div>
          <div className="h-5 w-px bg-white/10" />
        </div>
        
        <div className="flex-1 relative overflow-hidden px-2">
          <AnimatePresence mode="wait">
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
                <span className="text-white/80">{actions[currentIndex].action}</span>
                <span className="rounded-full px-2 py-0.5 bg-emerald/10 text-emerald text-xs font-medium">
                  {actions[currentIndex].result}
                </span>
              </div>
              <div className="text-white/50 text-xs font-mono">
                {getTimeAgo(actions[currentIndex].timestamp)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center space-x-2 pl-2">
          <div className="h-5 w-px bg-white/10" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-6 rounded-full bg-nova/10 flex items-center justify-center"
          >
            <Zap size={12} className="text-nova" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
