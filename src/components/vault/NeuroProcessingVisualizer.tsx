import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ChevronDown, Network, Activity, Zap, Code, Server } from "lucide-react";

interface NeuroProcessingVisualizerProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  score: number;
  onChange?: (score: number) => void;
}

type ProcessingNode = {
  id: string;
  type: 'input' | 'hidden' | 'output';
  x: number;
  y: number;
  status: 'active' | 'idle' | 'processing';
  processTime?: number;
};

type Connection = {
  source: string;
  target: string;
  active: boolean;
  strength: number;
};

export function NeuroProcessingVisualizer({ vaultType, score, onChange }: NeuroProcessingVisualizerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [nodes, setNodes] = useState<ProcessingNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [processingPower, setProcessingPower] = useState<number>(
    vaultType === 'nova' ? 128 : vaultType === 'orion' ? 96 : 64
  );
  const [networkLayers, setNetworkLayers] = useState<number>(
    vaultType === 'nova' ? 24 : vaultType === 'orion' ? 18 : 12
  );
  const [memoryUnits, setMemoryUnits] = useState<number>(
    vaultType === 'nova' ? 512 : vaultType === 'orion' ? 384 : 256
  );
  const [currentLoad, setCurrentLoad] = useState<number>(Math.floor(Math.random() * 30) + 50);
  const [processingMetrics, setProcessingMetrics] = useState({
    trainingCycles: Math.floor(Math.random() * 1000) + 5000,
    dataPointsAnalyzed: Math.floor(Math.random() * 10000) + 50000,
    predictionAccuracy: (Math.random() * 10 + 85).toFixed(2),
    optimizationRate: (Math.random() * 5 + 12).toFixed(2)
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        border: 'border-nova/20',
        gradient: 'from-nova to-amber-500',
        fillPrimary: 'bg-nova',
        nodeActive: '#f97316',
        nodeIdle: '#f9731640',
        nodeBorder: '#f97316',
        connection: '#f9731620',
        connectionActive: '#f97316'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        border: 'border-orion/20',
        gradient: 'from-orion to-yellow-500',
        fillPrimary: 'bg-orion',
        nodeActive: '#f59e0b',
        nodeIdle: '#f59e0b40',
        nodeBorder: '#f59e0b',
        connection: '#f59e0b20',
        connectionActive: '#f59e0b'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        border: 'border-emerald/20',
        gradient: 'from-emerald to-green-500',
        fillPrimary: 'bg-emerald',
        nodeActive: '#10b981',
        nodeIdle: '#10b98140',
        nodeBorder: '#10b981',
        connection: '#10b98120',
        connectionActive: '#10b981'
      };
    }
  };

  const colors = getTypeColor();

  // Generate neural network nodes and connections
  useEffect(() => {
    if (!showDetails) return;

    // Initial node setup - create a simplified neural network visualization
    const newNodes: ProcessingNode[] = [];
    // Input layer
    for (let i = 0; i < 3; i++) {
      newNodes.push({
        id: `input-${i}`,
        type: 'input',
        x: 10,
        y: 30 + i * 40,
        status: 'idle'
      });
    }

    // Hidden layer
    for (let i = 0; i < 5; i++) {
      newNodes.push({
        id: `hidden-${i}`,
        type: 'hidden',
        x: 80,
        y: 10 + i * 30,
        status: 'idle'
      });
    }

    // Output layer
    for (let i = 0; i < 2; i++) {
      newNodes.push({
        id: `output-${i}`,
        type: 'output',
        x: 150,
        y: 40 + i * 40,
        status: 'idle'
      });
    }

    setNodes(newNodes);

    // Create connections between nodes
    const newConnections: Connection[] = [];

    // Connect input to hidden
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        newConnections.push({
          source: `input-${i}`,
          target: `hidden-${j}`,
          active: false,
          strength: Math.random()
        });
      }
    }

    // Connect hidden to output
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        newConnections.push({
          source: `hidden-${i}`,
          target: `output-${j}`,
          active: false,
          strength: Math.random()
        });
      }
    }

    setConnections(newConnections);

    // Start neural network animation
    const interval = setInterval(() => {
      // Activate random input node
      const inputIndex = Math.floor(Math.random() * 3);
      const inputNodeId = `input-${inputIndex}`;

      setNodes(prevNodes => {
        return prevNodes.map(node => {
          if (node.id === inputNodeId) {
            return {
              ...node,
              status: 'active',
              processTime: Date.now()
            };
          }
          return node;
        });
      });

      setActiveNodes(prev => [...prev, inputNodeId]);

      // Propagate signal through network
      setTimeout(() => {
        const hiddenIndex = Math.floor(Math.random() * 5);
        const hiddenNodeId = `hidden-${hiddenIndex}`;

        setConnections(prevConn => {
          return prevConn.map(conn => {
            if (conn.source === inputNodeId && conn.target === hiddenNodeId) {
              return { ...conn, active: true };
            }
            return conn;
          });
        });

        setTimeout(() => {
          setNodes(prevNodes => {
            return prevNodes.map(node => {
              if (node.id === hiddenNodeId) {
                return {
                  ...node,
                  status: 'active',
                  processTime: Date.now()
                };
              }
              return node;
            });
          });

          setActiveNodes(prev => [...prev, hiddenNodeId]);

          setTimeout(() => {
            const outputIndex = Math.floor(Math.random() * 2);
            const outputNodeId = `output-${outputIndex}`;

            setConnections(prevConn => {
              return prevConn.map(conn => {
                if (conn.source === hiddenNodeId && conn.target === outputNodeId) {
                  return { ...conn, active: true };
                }
                return conn;
              });
            });

            setTimeout(() => {
              setNodes(prevNodes => {
                return prevNodes.map(node => {
                  if (node.id === outputNodeId) {
                    return {
                      ...node,
                      status: 'active',
                      processTime: Date.now()
                    };
                  }
                  return node;
                });
              });

              setActiveNodes(prev => [...prev, outputNodeId]);

              // Reset animations after a delay
              setTimeout(() => {
                setNodes(prevNodes => {
                  return prevNodes.map(node => {
                    if (activeNodes.includes(node.id)) {
                      return {
                        ...node,
                        status: 'idle'
                      };
                    }
                    return node;
                  });
                });

                setConnections(prevConn => {
                  return prevConn.map(conn => {
                    return { ...conn, active: false };
                  });
                });

                setActiveNodes([]);

                // Update processing metrics occasionally
                if (Math.random() > 0.7) {
                  setCurrentLoad(Math.floor(Math.random() * 30) + 50);
                  setProcessingMetrics(prev => ({
                    trainingCycles: prev.trainingCycles + Math.floor(Math.random() * 100),
                    dataPointsAnalyzed: prev.dataPointsAnalyzed + Math.floor(Math.random() * 1000),
                    predictionAccuracy: (Math.random() * 6 + 89).toFixed(2),
                    optimizationRate: (Math.random() * 3 + 12).toFixed(2)
                  }));
                }
              }, 1000);
            }, 300);
          }, 300);
        }, 300);
      }, 300);

    }, 3000);

    return () => clearInterval(interval);
  }, [showDetails, vaultType]);

  return (
    <div
      className={`w-full rounded-xl bg-black/40 backdrop-blur-sm border ${colors.border} p-4 relative overflow-hidden cursor-pointer group`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center gap-3 mb-2 justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
            <Cpu size={16} className={colors.primary} />
          </div>
          <div className="text-sm font-medium text-white">
            Neuro Processing
          </div>
        </div>
        <div className="flex items-center">
          <span className={`text-xl font-mono font-bold ${colors.primary}`}>{score}</span>
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

      {/* Simple stats below score */}
      <div className="flex justify-between mt-1 text-xs text-white/60">
        <span>Processing Units: {processingPower}</span>
        <span>Network Layers: {networkLayers}</span>
      </div>

      {/* Expanded details */}
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
              {/* System specs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Cpu size={12} className={colors.primary} />
                    <span>Processing</span>
                  </div>
                  <div className="font-mono text-sm">{processingPower} units</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Network size={12} className={colors.primary} />
                    <span>Layers</span>
                  </div>
                  <div className="font-mono text-sm">{networkLayers} layers</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Server size={12} className={colors.primary} />
                    <span>Memory</span>
                  </div>
                  <div className="font-mono text-sm">{memoryUnits} MB</div>
                </div>
              </div>

              {/* Current load */}
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className={colors.primary} />
                    <span>Current Load</span>
                  </div>
                  <div className="font-mono text-sm">{currentLoad}%</div>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.fillPrimary}`}
                    style={{ width: `${currentLoad}%` }}
                  ></div>
                </div>
              </div>

              {/* Network visualization */}
              <div className="bg-black/30 border border-white/10 rounded-lg p-3 h-36 relative overflow-hidden" ref={canvasRef}>
                <div className="absolute text-white/30 text-[10px] font-mono">
                  <div className="absolute top-1 left-2">Input Layer</div>
                  <div className="absolute top-1 left-[75px]">Hidden Layer</div>
                  <div className="absolute top-1 left-[145px]">Output Layer</div>
                </div>

                {/* Neural network connections */}
                <svg width="100%" height="100%" className="absolute inset-0">
                  {connections.map((conn, idx) => {
                    const source = nodes.find(n => n.id === conn.source);
                    const target = nodes.find(n => n.id === conn.target);

                    if (!source || !target) return null;

                    return (
                      <line
                        key={`${conn.source}-${conn.target}`}
                        x1={source.x + 5}
                        y1={source.y + 5}
                        x2={target.x + 5}
                        y2={target.y + 5}
                        stroke={conn.active ? colors.connectionActive : colors.connection}
                        strokeWidth={conn.active ? 2 : 1}
                        strokeOpacity={conn.active ? 1 : 0.6}
                      />
                    );
                  })}
                </svg>

                {/* Neural network nodes */}
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                    }}
                  >
                    <motion.div
                      className={`rounded-full border-2 absolute h-3 w-3 transform -translate-x-1/2 -translate-y-1/2`}
                      animate={{
                        scale: node.status === 'active' ? [1, 1.2, 1] : 1,
                        backgroundColor: node.status === 'active' ? colors.nodeActive : colors.nodeIdle,
                        borderColor: colors.nodeBorder,
                        boxShadow: node.status === 'active' ? `0 0 10px ${colors.nodeActive}` : 'none'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                ))}

                {/* Processing indicator */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-white/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Processing</span>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Neural Processing Metrics</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2 rounded-lg flex flex-col">
                    <div className="text-white/60 mb-1 flex items-center gap-1.5">
                      <Code size={10} className={colors.primary} />
                      <span>Training Cycles</span>
                    </div>
                    <div className="font-mono">{processingMetrics.trainingCycles.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg flex flex-col">
                    <div className="text-white/60 mb-1 flex items-center gap-1.5">
                      <Activity size={10} className={colors.primary} />
                      <span>Data Points</span>
                    </div>
                    <div className="font-mono">{processingMetrics.dataPointsAnalyzed.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg flex flex-col">
                    <div className="text-white/60 mb-1 flex items-center gap-1.5">
                      <Network size={10} className={colors.primary} />
                      <span>Prediction Accuracy</span>
                    </div>
                    <div className="font-mono">{processingMetrics.predictionAccuracy}%</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg flex flex-col">
                    <div className="text-white/60 mb-1 flex items-center gap-1.5">
                      <Zap size={10} className={colors.primary} />
                      <span>Optimization Rate</span>
                    </div>
                    <div className="font-mono">{processingMetrics.optimizationRate}/s</div>
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
