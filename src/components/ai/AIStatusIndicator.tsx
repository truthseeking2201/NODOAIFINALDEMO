import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Cpu,
  Zap,
  AlertCircle,
  CheckCircle2,
  LucideIcon,
  BarChart3,
  Lock,
  ChevronUp,
  ChevronDown,
  Sparkles,
  LineChart,
  Network
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types of AI functions/modes
type AIMode =
  | "analyzing"
  | "optimizing"
  | "monitoring"
  | "predicting"
  | "securing"
  | "idle"
  | "error"
  | "complete";

interface AIStatusHistory {
  timestamp: number;
  mode: AIMode;
  message: string;
}

interface AIStatusIndicatorProps {
  /** Current status mode */
  mode?: AIMode;
  /** Short message describing what AI is doing */
  message?: string;
  /** Show detailed information */
  detailed?: boolean;
  /** Color theme (defaults to nova - orange) */
  theme?: "nova" | "orion" | "emerald" | "violet";
  /** Include history of recent AI actions */
  showHistory?: boolean;
  /** Enable expanded view with more details */
  expandable?: boolean;
  /** Show active pulse animation */
  active?: boolean;
  /** Confidence level 0-100 */
  confidence?: number;
  /** Additional styles */
  className?: string;
}

export function AIStatusIndicator({
  mode = "monitoring",
  message,
  detailed = false,
  theme = "nova",
  showHistory = false,
  expandable = false,
  active = true,
  confidence = 87,
  className = "",
}: AIStatusIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<AIStatusHistory[]>([]);

  // Generate some realistic AI activity history
  useEffect(() => {
    if (!showHistory) return;

    const exampleHistory: AIStatusHistory[] = [
      {
        timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
        mode: "analyzing",
        message: "Analyzed market trends"
      },
      {
        timestamp: Date.now() - 1000 * 60 * 12, // 12 minutes ago
        mode: "optimizing",
        message: "Optimized portfolio allocation"
      },
      {
        timestamp: Date.now() - 1000 * 60 * 8, // 8 minutes ago
        mode: "predicting",
        message: "Updated yield forecasts"
      },
      {
        timestamp: Date.now() - 1000 * 60 * 3, // 3 minutes ago
        mode: "securing",
        message: "Security audit complete"
      },
      {
        timestamp: Date.now() - 1000 * 30, // 30 seconds ago
        mode: mode,
        message: message || getModeDefaultMessage(mode)
      }
    ];

    setHistory(exampleHistory);
  }, [mode, message, showHistory]);

  // Color mapping based on theme
  const getThemeColor = () => {
    switch (theme) {
      case "nova": return "text-[#F97316] border-[#F97316]/30 bg-[#F97316]/10";
      case "orion": return "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10";
      case "emerald": return "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10";
      case "violet": return "text-[#3E1672] border-[#3E1672]/30 bg-[#3E1672]/10";
    }
  };

  // Get icon based on mode
  const getIcon = (currentMode: AIMode): LucideIcon => {
    switch (currentMode) {
      case "analyzing": return Brain;
      case "optimizing": return Zap;
      case "monitoring": return Cpu;
      case "predicting": return LineChart;
      case "securing": return Lock;
      case "complete": return CheckCircle2;
      case "error": return AlertCircle;
      default: return Brain;
    }
  };

  // Get default message based on mode
  const getModeDefaultMessage = (currentMode: AIMode): string => {
    switch (currentMode) {
      case "analyzing": return "Analyzing market data";
      case "optimizing": return "Optimizing allocations";
      case "monitoring": return "Monitoring investments";
      case "predicting": return "Forecasting yields";
      case "securing": return "Securing assets";
      case "complete": return "Processes complete";
      case "error": return "System requires attention";
      case "idle": return "System idle";
      default: return "AI active";
    }
  };

  // Format timestamp relative to now
  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Generate a random performance metric message
  const getRandomPerformanceMessage = (): string => {
    const metrics = [
      `${confidence}% confidence score`,
      `${Math.floor(Math.random() * 20) + 80}% efficiency`,
      `${Math.floor(Math.random() * 5000) + 10000} data points`,
      `${Math.floor(Math.random() * 10) + 90}% accuracy`,
      `${Math.floor(Math.random() * 50) + 950}ms response time`
    ];

    return metrics[Math.floor(Math.random() * metrics.length)];
  };

  const Icon = getIcon(mode);
  const displayMessage = message || getModeDefaultMessage(mode);

  return (
    <div className={`${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={expanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`
            border rounded-lg overflow-hidden backdrop-blur-sm
            ${expanded ? "bg-[#121620]/80" : "bg-[#121620]/40"}
            ${expanded ? "border-white/15" : "border-white/10"}
          `}
        >
          {/* Always visible header section */}
          <div
            className={`
              flex items-center justify-between gap-2 p-2
              ${expandable ? "cursor-pointer hover:bg-white/5" : ""}
            `}
            onClick={() => expandable && setExpanded(!expanded)}
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-1.5 ${getThemeColor()}`}>
                <motion.div
                  animate={active ? {
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Icon size={14} />
                </motion.div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">NODO AI</span>
                  <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">v2.4</div>
                </div>

                <span className="text-xs text-white/60">
                  {displayMessage}
                </span>
              </div>
            </div>

            {detailed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="rounded-full h-7 w-7 flex items-center justify-center">
                      <div className="relative w-5 h-5">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="2.5"
                          />
                          <motion.circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke={
                              theme === "nova" ? "#F97316" :
                              theme === "orion" ? "#F59E0B" :
                              theme === "emerald" ? "#10B981" :
                              "#3E1672"
                            }
                            strokeWidth="2.5"
                            strokeDasharray="63"
                            strokeDashoffset={63 - ((confidence / 100) * 63)}
                            strokeLinecap="round"
                            transform="rotate(-90 12 12)"
                          />
                        </svg>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center text-[9px] font-medium"
                          animate={{ scale: active ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 2, repeat: active ? Infinity : 0 }}
                        >
                          {confidence}
                        </motion.div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-medium mb-1">AI Confidence Score</div>
                      <div className="text-white/70">Based on {Math.floor(Math.random() * 5000) + 15000} data points</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {expandable && (
              <div className="text-white/60">
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            )}
          </div>

          {/* Expandable content */}
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 px-3 py-2"
            >
              {/* Current operation details */}
              <div className="mb-4">
                <div className="text-xs text-white/40 mb-1">Current Operation</div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className={`text-${theme}-500`} />
                    <span className="text-sm">{displayMessage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Network size={10} />
                    <span>{getRandomPerformanceMessage()}</span>
                  </div>
                </div>
              </div>

              {/* Recent AI activity */}
              {showHistory && (
                <div>
                  <div className="text-xs text-white/40 mb-2">Recent Activity</div>
                  <div className="space-y-2">
                    {history.slice().reverse().map((item, index) => {
                      const ItemIcon = getIcon(item.mode);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getThemeColor()}`}>
                            <ItemIcon size={10} />
                          </div>
                          <div className="flex-1 text-xs">{item.message}</div>
                          <div className="text-[10px] text-white/40">{formatRelativeTime(item.timestamp)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI system status */}
              <div className="flex justify-between mt-3 pt-3 border-t border-white/5 text-[10px] text-white/40">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>System Healthy</span>
                </div>
                <div>Model: NodaLLM v4.2</div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={10} />
                  <span>{Math.floor(Math.random() * 30) + 70}/100</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
