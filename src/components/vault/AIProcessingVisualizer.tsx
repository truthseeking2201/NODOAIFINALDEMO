import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Network, Activity, Database, BarChart2, Lock, Shield } from "lucide-react";

interface AIProcessingVisualizerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "optimization" | "analysis" | "protection" | "monitoring";
  showDetails?: boolean;
  autoAnimate?: boolean;
  processingTime?: number;
}

export function AIProcessingVisualizer({
  className = "",
  size = "md",
  type = "optimization",
  showDetails = true,
  autoAnimate = true,
  processingTime = 3000
}: AIProcessingVisualizerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const processorRef = useRef<HTMLDivElement>(null);
  const [processorDimensions, setProcessorDimensions] = useState({ rows: 8, cols: 8 });
  const [processComplete, setProcessComplete] = useState(false);
  const [processingMetrics, setProcessingMetrics] = useState({
    dataPoints: 0,
    iterations: 0,
    confidence: 0,
    efficiency: 0
  });

  // Set dimensions based on size prop
  useEffect(() => {
    switch(size) {
      case "sm":
        setProcessorDimensions({ rows: 6, cols: 6 });
        break;
      case "lg":
        setProcessorDimensions({ rows: 10, cols: 10 });
        break;
      case "md":
      default:
        setProcessorDimensions({ rows: 8, cols: 8 });
    }
  }, [size]);

  // Auto-start animation if autoAnimate is true
  useEffect(() => {
    if (autoAnimate) {
      const timer = setTimeout(() => {
        startProcessing();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoAnimate]);

  // Main processing animation
  useEffect(() => {
    if (!isProcessing) return;

    const { rows, cols } = processorDimensions;
    const totalCells = rows * cols;
    const updateInterval = processingTime / 100; // 100 steps for smooth progress

    let progressValue = 0;
    const timer = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);

      // Randomly activate/deactivate nodes for visualization
      const cellCount = Math.floor((totalCells / 2) * (progressValue / 100)) + Math.floor(Math.random() * 5);
      const newActiveNodes: number[] = [];

      for (let i = 0; i < cellCount; i++) {
        newActiveNodes.push(Math.floor(Math.random() * totalCells));
      }

      setActiveNodes(newActiveNodes);

      // Update metrics
      const completionPercentage = progressValue / 100;
      setProcessingMetrics({
        dataPoints: Math.floor(completionPercentage * (2000 + Math.random() * 3000)),
        iterations: Math.floor(completionPercentage * (50 + Math.random() * 100)),
        confidence: completionPercentage * (0.85 + Math.random() * 0.15),
        efficiency: completionPercentage * (0.75 + Math.random() * 0.25)
      });

      if (progressValue >= 100) {
        clearInterval(timer);
        setProcessComplete(true);
        setIsProcessing(false);
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [isProcessing, processorDimensions, processingTime]);

  const startProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    setActiveNodes([]);
    setProcessComplete(false);
    setProcessingMetrics({
      dataPoints: 0,
      iterations: 0,
      confidence: 0,
      efficiency: 0
    });
  };

  const getTypeIcon = () => {
    switch(type) {
      case "analysis":
        return <BarChart2 size={24} className="text-orion" />;
      case "protection":
        return <Shield size={24} className="text-emerald" />;
      case "monitoring":
        return <Activity size={24} className="text-blue-400" />;
      case "optimization":
      default:
        return <Brain size={24} className="text-nova" />;
    }
  };

  const getTypeColor = () => {
    switch(type) {
      case "analysis": return "from-orion/30 to-orion/5";
      case "protection": return "from-emerald/30 to-emerald/5";
      case "monitoring": return "from-blue-400/30 to-blue-400/5";
      case "optimization":
      default: return "from-nova/30 to-nova/5";
    }
  };

  const getActionText = () => {
    switch(type) {
      case "analysis": return "Analyzing market data";
      case "protection": return "Implementing safeguards";
      case "monitoring": return "Monitoring positions";
      case "optimization":
      default: return "Optimizing yield strategies";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center">
        {/* Processor Grid */}
        <div
          ref={processorRef}
          className="ai-processor mb-3"
          style={{
            '--grid-rows': processorDimensions.rows,
            '--grid-cols': processorDimensions.cols
          } as React.CSSProperties}
        >
          {Array.from({ length: processorDimensions.rows * processorDimensions.cols }).map((_, index) => (
            <div
              key={index}
              className={`ai-processor-cell ${activeNodes.includes(index) ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Processing Status */}
        <div className="flex items-center justify-center mb-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTypeColor()} flex items-center justify-center mr-3`}>
            {getTypeIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">
              {isProcessing ? getActionText() : processComplete ? "Process Complete" : "Ready"}
            </div>
            {isProcessing && (
              <div className="text-xs text-white/60">
                {progress}% complete
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full ${type === 'optimization'
              ? 'bg-gradient-to-r from-nova/80 to-amber-500/80'
              : type === 'analysis'
                ? 'bg-gradient-to-r from-orion/80 to-yellow-400/80'
                : type === 'protection'
                  ? 'bg-gradient-to-r from-emerald/80 to-green-400/80'
                  : 'bg-gradient-to-r from-blue-400/80 to-blue-500/80'
            }`}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Processing Details */}
        {showDetails && (
          <AnimatePresence>
            {(isProcessing || processComplete) && (
              <motion.div
                className="grid grid-cols-2 gap-3 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center text-xs text-white/60 mb-1">
                    <Database size={10} className="mr-1" />
                    <span>Data Points Processed</span>
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {processingMetrics.dataPoints.toLocaleString()}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center text-xs text-white/60 mb-1">
                    <Cpu size={10} className="mr-1" />
                    <span>Model Iterations</span>
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {processingMetrics.iterations.toLocaleString()}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center text-xs text-white/60 mb-1">
                    <Network size={10} className="mr-1" />
                    <span>Confidence Score</span>
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {processingMetrics.confidence.toFixed(4)}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center text-xs text-white/60 mb-1">
                    <Activity size={10} className="mr-1" />
                    <span>Efficiency Rating</span>
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {processingMetrics.efficiency.toFixed(4)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Control Button - only if not auto-animating */}
        {!autoAnimate && !isProcessing && (
          <button
            onClick={startProcessing}
            className={`mt-3 px-4 py-2 rounded-lg border text-sm ${
              type === 'optimization'
                ? 'border-nova/30 bg-nova/10 text-nova hover:bg-nova/20'
                : type === 'analysis'
                  ? 'border-orion/30 bg-orion/10 text-orion hover:bg-orion/20'
                  : type === 'protection'
                    ? 'border-emerald/30 bg-emerald/10 text-emerald hover:bg-emerald/20'
                    : 'border-blue-400/30 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20'
            } transition-colors`}
          >
            {processComplete ? "Run Again" : "Start Processing"}
          </button>
        )}
      </div>
    </div>
  );
}
