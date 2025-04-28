import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Brain, Zap, ArrowUpRight, AlertCircle, CheckCircle2, Cpu, Terminal } from "lucide-react";

interface ProcessingCell {
  x: number;
  y: number;
  state: "inactive" | "processing" | "active" | "complete";
  value: number;
}

interface AIProcessingVisualizerProps {
  /** The number of cells in each row of the grid */
  gridSize?: number;
  /** The speed of the animation (lower is faster) */
  speed?: number;
  /** The dominant color theme */
  theme?: "nova" | "orion" | "emerald" | "violet";
  /** The current processing state */
  state?: "idle" | "analyzing" | "optimizing" | "complete" | "error";
  /** Message to display below the visualization */
  statusMessage?: string;
  /** The current processing progress (0-100) */
  progress?: number;
  /** Whether to display metrics */
  showMetrics?: boolean;
  /** Extra className to apply */
  className?: string;
  /** Whether to show the error state */
  showError?: boolean;
}

export function AIProcessingVisualizer({
  gridSize = 8,
  speed = 3,
  theme = "nova",
  state = "analyzing",
  statusMessage,
  progress = 0,
  showMetrics = true,
  className = "",
  showError = false,
}: AIProcessingVisualizerProps) {
  const [cells, setCells] = useState<ProcessingCell[]>([]);
  const [activeCells, setActiveCells] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const matrixRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Map theme to colors
  const themeColors = {
    nova: {
      primary: "rgba(249, 115, 22, 1)", // #F97316
      secondary: "rgba(249, 115, 22, 0.7)",
      tertiary: "rgba(249, 115, 22, 0.4)",
      glow: "0 0 15px rgba(249, 115, 22, 0.4)",
    },
    orion: {
      primary: "rgba(245, 158, 11, 1)", // #F59E0B
      secondary: "rgba(245, 158, 11, 0.7)",
      tertiary: "rgba(245, 158, 11, 0.4)",
      glow: "0 0 15px rgba(245, 158, 11, 0.4)",
    },
    emerald: {
      primary: "rgba(16, 185, 129, 1)", // #10B981
      secondary: "rgba(16, 185, 129, 0.7)",
      tertiary: "rgba(16, 185, 129, 0.4)",
      glow: "0 0 15px rgba(16, 185, 129, 0.4)",
    },
    violet: {
      primary: "rgba(62, 22, 114, 1)", // #3E1672
      secondary: "rgba(62, 22, 114, 0.7)",
      tertiary: "rgba(62, 22, 114, 0.4)",
      glow: "0 0 15px rgba(62, 22, 114, 0.4)",
    },
  };

  const currentTheme = themeColors[theme];

  // Initialize the cells
  useEffect(() => {
    const initialCells: ProcessingCell[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        initialCells.push({
          x,
          y,
          state: "inactive",
          value: Math.random(),
        });
      }
    }
    setCells(initialCells);
  }, [gridSize]);

  // Handle state transitions and effects with optimized performance
  useEffect(() => {
    if (cells.length === 0) return;

    if (state === "idle") {
      setActiveCells(0);
      setDataPoints(0);
      setConfidence(0);
      setCells(cells.map(cell => ({ ...cell, state: "inactive" })));
      return;
    }

    if (showError) {
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 },
      });
      return;
    }

    // Track timeouts for cleanup
    const timeouts: NodeJS.Timeout[] = [];

    // Simulate processing flow - use a reasonable interval
    const updateInterval = setInterval(() => {
      if (state === "complete") {
        setCells(prev => prev.map(cell => ({ ...cell, state: "complete" })));
        return;
      }

      setCells(prev => {
        if (state !== "analyzing" && state !== "optimizing") {
          return prev;
        }

        // Flow pattern based on direction
        const newCells = [...prev];
        const activeCount = newCells.filter(c => c.state === "active" || c.state === "processing").length;

        // Optimize by limiting the number of cells to process at once
        const inactiveCells = newCells.filter(c => c.state === "inactive");

        if (inactiveCells.length > 0) {
          // Activate new cells based on progress
          const totalCells = gridSize * gridSize;
          const targetActiveCells = Math.floor((progress / 100) * totalCells);

          // Limit cells to activate to prevent too many state updates
          const cellsToActivate = Math.min(
            2, // Limit to max 2 cells at a time for better performance
            Math.max(1, Math.floor(totalCells / 25)),
            targetActiveCells - activeCount
          );

          if (cellsToActivate > 0) {
            // Choose random inactive cells to activate
            const shuffled = [...inactiveCells].sort(() => 0.5 - Math.random());
            const toActivate = shuffled.slice(0, cellsToActivate);

            toActivate.forEach(cell => {
              const index = newCells.findIndex(c => c.x === cell.x && c.y === cell.y);
              if (index !== -1) {
                newCells[index].state = "processing";

                // After 100-300ms, change to active - track timeout for cleanup
                const timeout = setTimeout(() => {
                  // Batch updates to reduce renders
                  setCells(current => {
                    const updatedCells = [...current];
                    const cellIndex = updatedCells.findIndex(c => c.x === cell.x && c.y === cell.y);
                    if (cellIndex !== -1) {
                      updatedCells[cellIndex].state = "active";
                    }
                    return updatedCells;
                  });

                  // Batch these state updates together to reduce renders
                  setActiveCells(count => count + 1);
                  setDataPoints(count => count + Math.floor(Math.random() * 20) + 10);
                  setConfidence(Math.min(99, Math.floor(progress * 0.95)));
                }, 150 + Math.random() * 100); // Slightly tighter range of timeouts

                timeouts.push(timeout);
              }
            });
          }
        }

        return newCells;
      });
    }, Math.max(500, 1000 / speed)); // Ensure minimum 500ms interval for better performance

    // Cleanup function to clear all intervals and timeouts
    return () => {
      clearInterval(updateInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [state, progress, speed, gridSize, showError, controls]);

  // Processing cell component
  const Cell = ({ cell }: { cell: ProcessingCell }) => {
    let backgroundColor = "rgba(0, 0, 0, 0.3)";
    let boxShadow = "none";
    let size = "100%";

    switch (cell.state) {
      case "processing":
        backgroundColor = currentTheme.tertiary;
        break;
      case "active":
        backgroundColor = currentTheme.secondary;
        boxShadow = currentTheme.glow;
        break;
      case "complete":
        backgroundColor = currentTheme.primary;
        size = "60%";
        break;
      default:
        backgroundColor = "rgba(255, 255, 255, 0.03)";
    }

    return (
      <motion.div
        className="rounded relative"
        style={{
          backgroundColor,
          boxShadow,
          width: size,
          height: size,
          margin: "auto",
        }}
        animate={
          cell.state === "active"
            ? {
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{ duration: 2, repeat: cell.state === "active" ? Infinity : 0 }}
      />
    );
  };

  // Status indicator
  const StatusIndicator = () => {
    const getIcon = () => {
      switch (state) {
        case "analyzing":
          return <Brain size={14} className="text-white" />;
        case "optimizing":
          return <Zap size={14} className="text-white" />;
        case "complete":
          return <CheckCircle2 size={14} className="text-white" />;
        case "error":
          return <AlertCircle size={14} className="text-white" />;
        default:
          return <Cpu size={14} className="text-white" />;
      }
    };

    const getMessage = () => {
      if (statusMessage) return statusMessage;

      switch (state) {
        case "analyzing":
          return "Analyzing Data...";
        case "optimizing":
          return "Optimizing Strategy...";
        case "complete":
          return "Analysis Complete";
        case "error":
          return "Processing Error";
        default:
          return "Ready for Analysis";
      }
    };

    const getColor = () => {
      if (showError) return "bg-red-600";

      switch (state) {
        case "analyzing":
          return `bg-${theme}-600`;
        case "optimizing":
          return `bg-${theme}-600`;
        case "complete":
          return "bg-emerald-600";
        default:
          return "bg-gray-600";
      }
    };

    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getColor()} text-xs font-medium`}>
        <motion.div
          animate={state !== "idle" && state !== "complete" && !showError ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {getIcon()}
        </motion.div>
        <span>{getMessage()}</span>
      </div>
    );
  };

  // Terminal output effect with optimized rendering
  const TerminalOutput = () => {
    const [outputLines, setOutputLines] = useState<string[]>([]);

    // Memoize possible lines to prevent recreation on each render
    const possibleLines = useMemo(() => [
      "Loading neural network weights...",
      "Initializing tensor operations...",
      "Analyzing market patterns...",
      "Processing transaction history...",
      "Optimizing risk profile...",
      "Running predictive models...",
      "Calculating optimal positions...",
      "Applying neural boosting...",
      "Validating strategies...",
      "Executing tensor operations...",
      "Cross-referencing market data...",
      "Calculating confidence intervals...",
    ], []);

    useEffect(() => {
      // Skip terminal animation in certain states
      if (state === "idle" || state === "complete" || showError) {
        // Clear output lines when not active
        if (outputLines.length > 0) {
          setOutputLines([]);
        }
        return;
      }

      // Use a longer interval to reduce renders
      const interval = setInterval(() => {
        // Get a random line but make sure it's not the same as the most recent line
        const getRandomLine = () => {
          const randomIndex = Math.floor(Math.random() * possibleLines.length);
          const randomLine = possibleLines[randomIndex];

          // If this matches the most recent line and we have options, get another
          if (outputLines.length > 0 && randomLine === outputLines[outputLines.length - 1] && possibleLines.length > 1) {
            return getRandomLine();
          }

          return randomLine;
        };

        const randomLine = getRandomLine();

        setOutputLines(prev => {
          if (prev.length >= 3) {
            // Remove oldest line and add new one (more efficient than slice)
            return [prev[1], prev[2], randomLine];
          }
          return [...prev, randomLine];
        });
      }, 3000); // Longer interval (3s instead of 2s) to reduce updates

      return () => clearInterval(interval);
    }, [state, showError, possibleLines, outputLines]);

    // Don't render anything if there's nothing to show
    if (state === "idle" || outputLines.length === 0) return null;

    return (
      <div className="bg-black/50 border border-white/10 rounded-md p-2 text-xs font-mono mt-3 max-h-14 overflow-hidden">
        <div className="flex items-center gap-1.5 text-white/60 mb-1">
          <Terminal size={10} />
          <span>AI Process Output</span>
        </div>
        <AnimatePresence mode="popLayout">
          {outputLines.map((line, i) => (
            <motion.div
              key={`${line}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white/80"
            >
              <span className="text-green-500">{">"}</span> {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={controls}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <StatusIndicator />

          {showMetrics && (
            <div className="text-xs text-white/60 flex items-center gap-1">
              <ArrowUpRight size={12} className={`text-${theme}-500`} />
              <span>{progress}% complete</span>
            </div>
          )}
        </div>

        <motion.div
          ref={matrixRef}
          className={`grid gap-1 mb-3 ${showError ? 'opacity-50' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            aspectRatio: "1/1",
          }}
          animate={showError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {cells.map((cell, index) => (
            <Cell key={`${cell.x}-${cell.y}`} cell={cell} />
          ))}
        </motion.div>

        {showMetrics && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/20 backdrop-blur-sm rounded p-2 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">Active Cells</div>
              <div className="text-sm font-medium">{activeCells}</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded p-2 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">Data Points</div>
              <div className="text-sm font-medium">{dataPoints.toLocaleString()}</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded p-2 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">Confidence</div>
              <div className="text-sm font-medium">{confidence}%</div>
            </div>
          </div>
        )}

        <TerminalOutput />

        {showError && (
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center p-4">
              <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Processing Error</h3>
              <p className="text-white/60 text-sm">Neural network encountered an issue</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
