import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  pulseDelay: number;
}

interface Connection {
  from: number;
  to: number;
  active: boolean;
  speed: number;
  progress: number;
  width: number;
  color: string;
}

interface NeuralNetworkBackgroundProps {
  nodeCount?: number;
  connectionDensity?: number;
  className?: string;
  nodesColor?: string;
  connectionsColor?: string;
  activeNodeColor?: string;
  flowSpeed?: number;
}

export function NeuralNetworkBackground({
  nodeCount = 25,
  connectionDensity = 0.3,
  className = "",
  nodesColor = "rgba(249, 115, 22, 0.6)",
  connectionsColor = "rgba(249, 115, 22, 0.15)",
  activeNodeColor = "rgba(249, 115, 22, 0.9)",
  flowSpeed = 1
}: NeuralNetworkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Initialize nodes and connections
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    // Call once on mount
    updateSize();

    // Set up resize listener
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Create nodes and connections once we have container size
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0 || isInitialized) return;

    // Create nodes
    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        id: i,
        x: Math.random() * containerSize.width,
        y: Math.random() * containerSize.height,
        size: Math.random() * 3 + 2,
        color: nodesColor,
        pulseDelay: Math.random() * 5
      });
    }
    setNodes(newNodes);

    // Create connections
    const newConnections: Connection[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < connectionDensity) {
          newConnections.push({
            from: i,
            to: j,
            active: Math.random() < 0.3,
            speed: (Math.random() * 0.5 + 0.5) * flowSpeed,
            progress: Math.random(),
            width: Math.random() * 1 + 0.5,
            color: connectionsColor
          });
        }
      }
    }
    setConnections(newConnections);
    setIsInitialized(true);
  }, [containerSize, nodeCount, connectionDensity, isInitialized, nodesColor, connectionsColor, flowSpeed]);

  // Animation loop for data flow
  useEffect(() => {
    if (!isInitialized) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setConnections(prev =>
        prev.map(conn => {
          if (conn.active) {
            let newProgress = conn.progress + (deltaTime / 3000) * conn.speed;
            if (newProgress > 1) {
              newProgress = 0;
              // 70% chance to deactivate after one cycle
              if (Math.random() < 0.7) {
                return { ...conn, active: false, progress: 0 };
              }
            }
            return { ...conn, progress: newProgress };
          } else {
            // 2% chance to activate an inactive connection each frame
            if (Math.random() < 0.002) {
              return { ...conn, active: true, progress: 0 };
            }
            return conn;
          }
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];

          if (!fromNode || !toNode) return null;

          return (
            <React.Fragment key={`conn-${index}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={conn.color}
                strokeWidth={conn.width}
                strokeOpacity={0.3}
              />

              {conn.active && (
                <circle
                  cx={fromNode.x + (toNode.x - fromNode.x) * conn.progress}
                  cy={fromNode.y + (toNode.y - fromNode.y) * conn.progress}
                  r={2}
                  fill={activeNodeColor}
                  className="neural-data-particle"
                >
                  <animate
                    attributeName="r"
                    values="1.5;2.5;1.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </React.Fragment>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={node.color}
            animate={{
              r: [node.size, node.size * 1.3, node.size],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: node.pulseDelay,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}
