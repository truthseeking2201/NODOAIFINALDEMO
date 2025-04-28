import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Brain,
  Zap,
  BarChart3,
  TrendingUp,
  Lightbulb,
  ShieldCheck
} from "lucide-react";

interface AIActivityNotificationProps {
  vaultType: 'nova' | 'orion' | 'emerald';
}

// Activity types to cycle through
type ActivityType = 'optimize' | 'analyze' | 'security' | 'predict' | 'rebalance';

interface ActivityData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function AIActivityNotification({ vaultType }: AIActivityNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('optimize');

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        bgLight: 'bg-nova/10',
        bgDark: 'bg-nova/20',
        border: 'border-nova/30',
        glow: 'neural-glow-nova'
      };
      case 'orion': return {
        primary: 'text-orion',
        bgLight: 'bg-orion/10',
        bgDark: 'bg-orion/20',
        border: 'border-orion/30',
        glow: 'neural-glow-orion'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        bgLight: 'bg-emerald/10',
        bgDark: 'bg-emerald/20',
        border: 'border-emerald/30',
        glow: 'neural-glow-emerald'
      };
    }
  };

  const colors = getTypeColor();

  // Activity data for different notification types
  const activities: Record<ActivityType, ActivityData> = {
    optimize: {
      icon: <Brain className={colors.primary} size={16} />,
      title: "Neural Optimization",
      description: vaultType === 'nova'
        ? "AI is fine-tuning swap parameters to capture market inefficiencies"
        : vaultType === 'orion'
        ? "AI is balancing risk-reward ratios based on market conditions"
        : "AI is adjusting position sizes to minimize volatility exposure"
    },
    analyze: {
      icon: <Cpu className={colors.primary} size={16} />,
      title: "Market Analysis",
      description: vaultType === 'nova'
        ? "Neural processing of 28 trading indicators in real-time"
        : vaultType === 'orion'
        ? "AI analyzing price action across 6 related trading pairs"
        : "AI examining volatility patterns to protect capital"
    },
    security: {
      icon: <ShieldCheck className={colors.primary} size={16} />,
      title: "Risk Management",
      description: vaultType === 'nova'
        ? "Neural security scanning for high volatility events"
        : vaultType === 'orion'
        ? "AI evaluating slippage conditions across liquidity pools"
        : "Advanced risk mitigation protocols active"
    },
    predict: {
      icon: <Lightbulb className={colors.primary} size={16} />,
      title: "Price Prediction",
      description: vaultType === 'nova'
        ? "AI forecasting short-term price movements for optimal entry"
        : vaultType === 'orion'
        ? "Neural model predicting medium-term price trends"
        : "AI predicting volatility patterns for defensive positioning"
    },
    rebalance: {
      icon: <BarChart3 className={colors.primary} size={16} />,
      title: "Portfolio Rebalancing",
      description: vaultType === 'nova'
        ? "AI optimizing position allocation for maximum yield"
        : vaultType === 'orion'
        ? "Neural rebalancing for optimal risk-adjusted returns"
        : "Conservative rebalancing to preserve capital"
    }
  };

  // Generate random timeouts for more natural appearance
  const getRandomTimeout = () => Math.floor(Math.random() * 10000) + 15000; // Between 15-25s

  // Cycle through showing different activities
  useEffect(() => {
    // Initially show after a few seconds
    const initialDelay = setTimeout(() => {
      setShowNotification(true);

      // Hide after a few seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }, 5000);

    // Set up interval to show notifications periodically
    const interval = setInterval(() => {
      // Randomly select a new activity type (excluding 'analyze' and 'security')
      const activityTypes: ActivityType[] = ['optimize', 'predict', 'rebalance'];
      const newActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      setCurrentActivity(newActivity);

      // Show notification
      setShowNotification(true);

      // Hide after a few seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }, getRandomTimeout());

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [vaultType]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          className={`fixed top-24 right-6 z-50 max-w-xs ${colors.glow} rounded-xl`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`p-4 rounded-xl shadow-lg backdrop-blur-md border ${
            colors.bgLight} ${colors.border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colors.bgDark} relative`}>
                {activities[currentActivity].icon}
                <motion.div
                  className={`absolute inset-0 rounded-lg ${colors.border} border`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white">
                    {activities[currentActivity].title}
                  </h4>
                  <div className="ai-thinking h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  {activities[currentActivity].description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
