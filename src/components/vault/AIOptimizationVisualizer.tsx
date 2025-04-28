import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, Zap, ShieldCheck, Cpu, RefreshCw } from "lucide-react";

interface AIOptimizationVisualizerProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  onOptimizationEvent?: (event: string) => void;
}

export function AIOptimizationVisualizer({
  vaultType,
  onOptimizationEvent
}: AIOptimizationVisualizerProps) {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [optimizationEvents, setOptimizationEvents] = useState<Array<{
    id: number;
    text: string;
    type: 'analysis' | 'optimization' | 'security' | 'rebalance';
    timestamp: Date;
  }>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'from-nova/20 to-transparent',
        pulse: 'rgba(249, 115, 22, 0.4)',
        connection: 'rgba(249, 115, 22, 0.15)'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'from-orion/20 to-transparent',
        pulse: 'rgba(245, 158, 11, 0.4)',
        connection: 'rgba(245, 158, 11, 0.15)'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'from-emerald/20 to-transparent',
        pulse: 'rgba(16, 185, 129, 0.4)',
        connection: 'rgba(16, 185, 129, 0.15)'
      };
    }
  };

  const colors = getTypeColor();

  // Sample optimization events
  const events = [
    { text: "Analyzing market liquidity conditions", type: 'analysis' },
    { text: "Optimizing swap parameters for minimal slippage", type: 'optimization' },
    { text: "Detecting price inefficiencies", type: 'analysis' },
    { text: "Rebalancing position to maximize APR", type: 'rebalance' },
    { text: "Adjusting risk parameters based on volatility", type: 'security' },
    { text: "Neural model predicting short-term price action", type: 'analysis' },
    { text: "Implementing defensive position for capital preservation", type: 'security' },
    { text: "Optimizing gas fees for transactions", type: 'optimization' },
    { text: "Capturing arbitrage opportunity", type: 'optimization' },
    { text: "Reallocating capital to higher yield strategies", type: 'rebalance' }
  ];

  // Simulate AI optimization events
  useEffect(() => {
    const interval = setInterval(() => {
      // Random node activation
      setActiveNode(Math.floor(Math.random() * 9));

      // Progress bar simulation
      setOptimizationProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 100 ? 0 : newProgress;
      });

      // Sometimes trigger optimization event
      if (Math.random() > 0.7) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const newEvent = {
          id: Date.now(),
          text: randomEvent.text,
          type: randomEvent.type as 'analysis' | 'optimization' | 'security' | 'rebalance',
          timestamp: new Date()
        };

        setOptimizationEvents(prev => [newEvent, ...prev].slice(0, 5));
        if (onOptimizationEvent) {
          onOptimizationEvent(newEvent.text);
        }

        // Show optimization pulse effect
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 1000);

        // Sometimes show optimization in progress
        if (Math.random() > 0.8) {
          setIsOptimizing(true);
          setTimeout(() => setIsOptimizing(false), 3000 + Math.random() * 2000);
        }
      }
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);

  // Render optimization event icon based on type
  const renderEventIcon = (type: 'analysis' | 'optimization' | 'security' | 'rebalance') => {
    switch (type) {
      case 'analysis':
        return <Brain size={14} className={colors.primary} />;
      case 'optimization':
        return <TrendingUp size={14} className={colors.primary} />;
      case 'security':
        return <ShieldCheck size={14} className={colors.primary} />;
      case 'rebalance':
        return <RefreshCw size={14} className={colors.primary} />;
    }
  };

  return (
    <div className="relative bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 overflow-hidden">
      {/* Neural network visualization */}
      <div className="h-52 relative">
        {/* Neural nodes */}
        <div className="grid grid-cols-3 gap-x-12 gap-y-8 absolute inset-0">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center"
            >
              {/* Connection lines */}
              {index < 6 && (
                <>
                  <div className="absolute w-12 h-px bg-gradient-to-r from-transparent to-white/10 top-1/2 -right-12"></div>
                  <div className="absolute w-px h-8 bg-gradient-to-b from-transparent to-white/10 -bottom-8 left-1/2"></div>
                </>
              )}

              <motion.div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center
                  ${activeNode === index ? 'border border-white/20' : 'opacity-60'}`}
                animate={{
                  scale: activeNode === index ? [1, 1.2, 1] : 1,
                  opacity: activeNode === index ? 1 : 0.6,
                }}
                transition={{ duration: 0.5 }}
              >
                {index % 3 === 0 && <Brain size={16} className={colors.primary} />}
                {index % 3 === 1 && <Cpu size={16} className={colors.primary} />}
                {index % 3 === 2 && <Zap size={16} className={colors.primary} />}

                {/* Pulse effect */}
                {activeNode === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: 1 }}
                    style={{ borderWidth: 1, borderColor: colors.pulse }}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Optimization pulse effect */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{
                background: `radial-gradient(circle, ${colors.pulse} 0%, transparent 70%)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              vaultType === 'nova' ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
              vaultType === 'orion' ? 'bg-gradient-to-r from-amber-600 to-yellow-500' :
              'bg-gradient-to-r from-emerald to-green-500'
            }`}
            style={{ width: `${optimizationProgress}%` }}
          />
        </div>

        {/* Optimization overlay */}
        <AnimatePresence>
          {isOptimizing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg}`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain size={20} className={colors.primary} />
                  </motion.div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Neural Optimization</div>
                  <div className="text-xs text-white/70">Processing market data...</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent optimization events */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Live AI Optimization</h3>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-white/70">Active</span>
          </div>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
          {optimizationEvents.map(event => (
            <motion.div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-0.5">{renderEventIcon(event.type)}</div>
              <div className="flex-1">
                <div className="text-white/90 text-xs">{event.text}</div>
                <div className="text-white/50 text-[10px] mt-0.5">
                  {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {optimizationEvents.length === 0 && (
            <div className="text-center py-4 text-white/40 text-xs">
              Waiting for optimization events...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
