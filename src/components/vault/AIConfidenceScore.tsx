import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, Info, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIConfidenceScoreProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  score: number;
  onChange?: (score: number) => void;
}

export function AIConfidenceScore({ vaultType, score, onChange }: AIConfidenceScoreProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [history, setHistory] = useState<{value: number, timestamp: Date}[]>([
    {value: score - 2, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)},
    {value: score - 1, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12)},
    {value: score, timestamp: new Date()}
  ]);

  const getScoreCategory = (value: number) => {
    if (value >= 90) return {label: "High", color: "text-green-500"};
    if (value >= 75) return {label: "Medium", color: "text-amber-500"};
    return {label: "Low", color: "text-red-500"};
  };

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        border: 'border-nova/20',
        gradient: 'from-nova to-amber-500',
        fillPrimary: 'bg-nova',
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        border: 'border-orion/20',
        gradient: 'from-orion to-yellow-500',
        fillPrimary: 'bg-orion',
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        border: 'border-emerald/20',
        gradient: 'from-emerald to-green-500',
        fillPrimary: 'bg-emerald',
      };
    }
  };

  const colors = getTypeColor();
  const scoreCategory = getScoreCategory(score);

  // Confidence factors that make up the score
  const confidenceFactors = [
    {
      name: "Market Analysis",
      score: score * (Math.random() * 0.2 + 0.9),
      description: "Assessment of current market conditions and trends"
    },
    {
      name: "Historical Pattern Recognition",
      score: score * (Math.random() * 0.2 + 0.85),
      description: "Analysis of similar past scenarios and outcomes"
    },
    {
      name: "Risk Assessment",
      score: score * (Math.random() * 0.2 + 0.8),
      description: "Evaluation of potential downside risks"
    },
    {
      name: "Algorithm Performance",
      score: score * (Math.random() * 0.2 + 0.95),
      description: "Accuracy of previous AI predictions and decisions"
    }
  ];

  // Simulate updating score history periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new history point every 12 hours (simulated)
      const lastPoint = history[history.length - 1];
      const timeDiff = Date.now() - lastPoint.timestamp.getTime();

      if (timeDiff > 1000 * 60 * 60 * 12) {
        // Add a new data point
        setHistory(prev => [...prev, {
          value: score,
          timestamp: new Date()
        }]);
      }
    }, 10000); // Check every 10 seconds (for demo)

    return () => clearInterval(interval);
  }, [score, history]);

  // Calculate recent change
  const recentChange = history.length > 1
    ? score - history[history.length - 2].value
    : 0;

  return (
    <div
      className={`w-full rounded-xl bg-black/40 backdrop-blur-sm border ${colors.border} p-4 relative overflow-hidden cursor-pointer group`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center gap-3 mb-2 justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
            <Brain size={16} className={colors.primary} />
          </div>
          <div className="text-sm font-medium text-white">
            AI Confidence Score
          </div>
        </div>
        <div className="flex items-center">
          <span className={`text-xl font-mono font-bold ${colors.primary}`}>{Math.round(score)}</span>
          <div className="flex items-center ml-2">
            {recentChange !== 0 && (
              <div className={`text-xs flex items-center ${recentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {recentChange > 0 ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                <span className="ml-0.5">{Math.abs(recentChange).toFixed(1)}</span>
              </div>
            )}
          </div>
          <ChevronDown
            size={16}
            className="ml-1 text-white/50 transition-transform group-hover:text-white/80"
            style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
        ></motion.div>
      </div>

      {/* Simple label below score */}
      <div className="flex justify-between mt-1 text-xs text-white/60">
        <span>Confidence Level: <span className={scoreCategory.color}>{scoreCategory.label}</span></span>
        <span>Updated: {formatTimestamp(history[history.length - 1].timestamp)}</span>
      </div>

      {/* Explanation details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 text-xs text-white/70 space-y-3">
              <p>AI confidence score reflects the system's certainty in its current investment strategy based on multiple factors:</p>

              <div className="space-y-2">
                {confidenceFactors.map((factor) => (
                  <TooltipProvider key={factor.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                          onMouseEnter={() => setHoveredFactor(factor.name)}
                          onMouseLeave={() => setHoveredFactor(null)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="flex items-center">
                              {factor.name}
                              <Info size={10} className="ml-1 text-white/60" />
                            </span>
                            <span className="text-xs font-mono">{Math.round(factor.score)}%</span>
                          </div>
                          <div className="mt-1 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.fillPrimary}`}
                              style={{ width: `${factor.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">{factor.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              {/* Artificial history graph */}
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-xs font-medium mb-2">Confidence Score History</div>
                <div className="h-16 relative">
                  <div className="absolute inset-0 flex items-end">
                    {history.map((point, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-full max-w-[6px] mx-auto rounded-sm ${colors.fillPrimary}`}
                          style={{
                            height: `${(point.value / 100) * 80}%`,
                            opacity: i === history.length - 1 ? 1 : 0.5 + (i / history.length) * 0.5
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper to format timestamp
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
