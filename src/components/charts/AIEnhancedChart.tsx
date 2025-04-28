import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts";
import {
  Brain,
  ChevronDown,
  ExternalLink,
  Info,
  Lightbulb,
  LineChart as LineChartIcon,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types
type ChartType = "line" | "area" | "combo";
type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
type Insight = {
  type: "positive" | "negative" | "neutral" | "warning";
  title: string;
  description: string;
  position?: number; // Position on the x-axis (index) where the insight should be marked
};

interface DataPoint {
  date: string;
  value: number;
  aiPrediction?: number;
  aiLowerBound?: number;
  aiUpperBound?: number;
  [key: string]: any;
}

interface AIEnhancedChartProps {
  /** Chart data */
  data: DataPoint[];
  /** Type of chart to render */
  chartType?: ChartType;
  /** Primary color theme */
  theme?: "nova" | "orion" | "emerald" | "violet";
  /** Whether to show AI predictions */
  showPredictions?: boolean;
  /** Whether to show AI insights */
  showInsights?: boolean;
  /** Whether to animate chart on mount */
  animated?: boolean;
  /** Chart title */
  title?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Unit for values (e.g. $, %) */
  valueUnit?: string;
  /** Current selected time range */
  timeRange?: TimeRange;
  /** Callback for time range change */
  onTimeRangeChange?: (range: TimeRange) => void;
  /** Available time ranges */
  timeRanges?: TimeRange[];
  /** AI-generated insights about the data */
  insights?: Insight[];
  /** Whether to show comparison with previous period */
  showComparison?: boolean;
  /** Comparison percentage */
  comparisonPercentage?: number;
  /** Extra className */
  className?: string;
}

export function AIEnhancedChart({
  data = [],
  chartType = "area",
  theme = "nova",
  showPredictions = true,
  showInsights = true,
  animated = true,
  title = "Performance",
  yAxisLabel,
  valueUnit = "$",
  timeRange = "1M",
  onTimeRangeChange,
  timeRanges = ["1D", "1W", "1M", "3M", "1Y", "ALL"],
  insights = [],
  showComparison = true,
  comparisonPercentage = 5.7,
  className = "",
}: AIEnhancedChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [insightPanelOpen, setInsightPanelOpen] = useState(false);
  const [highlightedInsight, setHighlightedInsight] = useState<Insight | null>(null);
  const [hoveredInsightIndex, setHoveredInsightIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [progress, setProgress] = useState(0);

  // Demo insights if none provided
  const defaultInsights: Insight[] = [
    {
      type: "positive",
      title: "Upward trend detected",
      description: "AI detected a sustainable growth pattern over the last 7 days, suggesting positive momentum.",
      position: Math.floor(data.length * 0.75)
    },
    {
      type: "warning",
      title: "Volatility increased",
      description: "There's a 2.1x increase in volatility compared to the previous period, consider adjustment.",
      position: Math.floor(data.length * 0.45)
    },
    {
      type: "neutral",
      title: "Market correlation",
      description: "Asset performance correlates with broader market trends during this period.",
      position: Math.floor(data.length * 0.2)
    }
  ];

  const actualInsights = insights.length > 0 ? insights : defaultInsights;

  // Update chart width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth);
      }
    };

    // Initial update
    updateWidth();

    // Add resize listener
    window.addEventListener("resize", updateWidth);

    // Cleanup
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Animate chart on mount with optimized animation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (animated) {
      // Reset progress
      setProgress(0);

      // Use a faster interval for smoother animation but less CPU usage
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (timer) clearInterval(timer);
            return 100;
          }
          // Increase by larger steps to reduce the number of renders
          return Math.min(100, prev + 4);
        });
      }, 20);
    } else {
      setProgress(100);
    }

    // Cleanup
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [animated]);

  // Get color based on theme
  const getThemeColor = (opacity = 1) => {
    switch (theme) {
      case "nova": return `rgba(249, 115, 22, ${opacity})`;
      case "orion": return `rgba(245, 158, 11, ${opacity})`;
      case "emerald": return `rgba(16, 185, 129, ${opacity})`;
      case "violet": return `rgba(62, 22, 114, ${opacity})`;
    }
  };

  // Get accent color for positivity/negativity
  const getAccentColor = (type: "positive" | "negative" | "neutral" | "warning", opacity = 1) => {
    switch (type) {
      case "positive": return `rgba(16, 185, 129, ${opacity})`;
      case "negative": return `rgba(239, 68, 68, ${opacity})`;
      case "warning": return `rgba(245, 158, 11, ${opacity})`;
      case "neutral":
      default: return `rgba(255, 255, 255, ${opacity})`;
    }
  };

  // Handle chart hover
  const handleMouseMove = (e: any) => {
    if (e.activeTooltipIndex !== undefined) {
      setActiveIndex(e.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-md bg-black/70 border border-white/10 p-2 rounded-lg text-white shadow-lg">
          <p className="text-xs text-white/70 mb-1">{label}</p>
          <div className="flex gap-4">
            <p className="text-sm font-medium">
              {valueUnit}{payload[0].value.toLocaleString()}
            </p>
            {showPredictions && payload[0].payload.aiPrediction !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <Brain size={12} className="text-nova" />
                <span className="text-white/70">Predicted:</span>
                <span className="font-medium">{valueUnit}{payload[0].payload.aiPrediction.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // Calculate visible data based on animation progress
  const visibleData = React.useMemo(() => {
    if (progress >= 100) return data;

    const visibleCount = Math.floor((data.length * progress) / 100);
    return data.slice(0, visibleCount);
  }, [data, progress]);

  // Calculate chart domain for dynamic sizing
  const calculateDomain = () => {
    if (!data || data.length === 0) return [0, 100];

    // Find min and max including predictions if they exist
    let allValues: number[] = data.map(d => d.value);

    if (showPredictions) {
      data.forEach(d => {
        if (d.aiPrediction !== undefined) allValues.push(d.aiPrediction);
        if (d.aiUpperBound !== undefined) allValues.push(d.aiUpperBound);
        if (d.aiLowerBound !== undefined) allValues.push(d.aiLowerBound);
      });
    }

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    // Add 10% padding to top and bottom
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  };

  // Insight marker component
  const InsightMarker = ({ insight, index }: { insight: Insight, index: number }) => {
    const position = insight.position !== undefined ? insight.position : Math.floor(data.length * 0.5);

    // Make sure position is within data range
    const validPosition = Math.min(Math.max(0, position), data.length - 1);
    const dataPoint = data[validPosition];

    // If no data point exists, don't render marker
    if (!dataPoint) return null;

    // Get type-based color
    const markerColor = getAccentColor(insight.type);
    const isHovered = hoveredInsightIndex === index;

    return (
      <motion.g
        onMouseEnter={() => setHoveredInsightIndex(index)}
        onMouseLeave={() => setHoveredInsightIndex(null)}
        onClick={() => {
          setHighlightedInsight(insight);
          setInsightPanelOpen(true);
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0.7,
          scale: isHovered ? 1.2 : 1,
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={0}
          cy={0}
          r={isHovered ? 5 : 4}
          fill={markerColor}
          stroke={isHovered ? "white" : "rgba(255,255,255,0.2)"}
          strokeWidth={isHovered ? 2 : 1}
        />
        {isHovered && (
          <circle
            cx={0}
            cy={0}
            r={12}
            fill="transparent"
            stroke={markerColor}
            strokeWidth={1}
            strokeDasharray="2 2"
            opacity={0.5}
          />
        )}
        {isHovered && (
          <g transform="translate(-4, -4)">
            {insight.type === "positive" && (
              <path d="M4 1v6M1 4h6" stroke="white" strokeWidth="1.5" />
            )}
            {insight.type === "negative" && (
              <path d="M1 4h6" stroke="white" strokeWidth="1.5" />
            )}
            {insight.type === "warning" && (
              <path d="M4 1L7 6H1L4 1Z M4 4.5V5 M4 6V6.01" stroke="white" strokeWidth="1.5" fill="none" />
            )}
            {insight.type === "neutral" && (
              <path d="M4 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4 6v.01M4 3v2" stroke="white" strokeWidth="1.5" />
            )}
          </g>
        )}
      </motion.g>
    );
  };

  // Removed unnecessary Minus component as we now use SVG paths directly

  // Insight type icon
  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "positive": return <TrendingUp size={16} />;
      case "negative": return <ArrowDown size={16} />;
      case "warning": return <AlertTriangle size={16} />;
      case "neutral":
      default: return <Info size={16} />;
    }
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 ${className}`}>
      {/* Chart header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon size={18} className={`text-${theme}-500`} />
            <h3 className="text-lg font-medium">{title}</h3>

            {/* AI indicators */}
            {showPredictions && (
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-nova/10 border border-nova/20 text-nova/90">
                      <Brain size={10} />
                      <span>AI Enhanced</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">This chart includes AI-generated predictions and insights</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Period comparison */}
          {showComparison && (
            <div className="flex items-center mt-1 text-sm">
              <span className="text-white/60 mr-1">vs. previous period:</span>
              {comparisonPercentage >= 0 ? (
                <motion.div
                  className="text-emerald-500 flex items-center gap-0.5"
                  animate={{ y: ["0%", "-5%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowUp size={14} />
                  <span>+{comparisonPercentage}%</span>
                </motion.div>
              ) : (
                <motion.div
                  className="text-red-500 flex items-center gap-0.5"
                  animate={{ y: ["0%", "5%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowDown size={14} />
                  <span>{comparisonPercentage}%</span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Time range selector */}
        <div className="flex gap-1 bg-black/20 rounded-lg p-1 border border-white/5 text-sm">
          {timeRanges.map(range => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={`px-2 py-1 h-auto rounded text-xs ${
                timeRange === range
                  ? `bg-${theme}-500/20 text-${theme}-500 hover:bg-${theme}-500/30`
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div ref={chartRef} className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart
              data={visibleData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`${theme}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeColor(0.5)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={getThemeColor(0.1)} stopOpacity={0.1} />
                </linearGradient>

                {/* Prediction gradient */}
                <linearGradient id={`${theme}PredictionGradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeColor(0.3)} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={getThemeColor(0.1)} stopOpacity={0.1} />
                </linearGradient>

                {/* Filter for glow effect */}
                <filter id={`${theme}Glow`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="glow" />
                  <feBlend in="SourceGraphic" in2="glow" mode="normal" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                domain={calculateDomain()}
                label={
                  yAxisLabel ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
                  } : undefined
                }
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Prediction confidence area */}
              {showPredictions && (
                <Area
                  type="monotone"
                  dataKey="aiUpperBound"
                  stroke="none"
                  fill="none"
                  activeDot={false}
                  stackId="1"
                />
              )}

              {showPredictions && (
                <Area
                  type="monotone"
                  dataKey="aiLowerBound"
                  stroke="none"
                  fillOpacity={0.1}
                  fill={getThemeColor(0.1)}
                  activeDot={false}
                  stackId="2"
                />
              )}

              {/* Actual line */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={getThemeColor(1)}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${theme}Gradient)`}
                activeDot={{
                  r: 6,
                  stroke: "white",
                  strokeWidth: 2,
                  fill: getThemeColor(1),
                  filter: `url(#${theme}Glow)`
                }}
              />

              {/* AI Prediction line */}
              {showPredictions && (
                <Area
                  type="monotone"
                  dataKey="aiPrediction"
                  stroke={getThemeColor(0.7)}
                  strokeDasharray="5 3"
                  strokeWidth={2}
                  fillOpacity={0}
                  activeDot={{
                    r: 5,
                    stroke: "white",
                    strokeWidth: 1,
                    fill: getThemeColor(0.7)
                  }}
                />
              )}

              {/* Insight markers */}
              {showInsights && actualInsights.map((insight, idx) => {
                const position = insight.position !== undefined
                  ? insight.position
                  : Math.floor(data.length * ((idx + 1) / (actualInsights.length + 1)));

                const validPosition = Math.min(Math.max(0, position), data.length - 1);
                const dataPoint = data[validPosition];

                if (!dataPoint) return null;

                return (
                  <ReferenceLine
                    key={idx}
                    x={dataPoint.date}
                    stroke={getAccentColor(insight.type, 0.3)}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={({viewBox}) => {
                      const {x, y} = viewBox;
                      return (
                        <InsightMarker insight={insight} index={idx} />
                      );
                    }}
                  />
                );
              })}

            </AreaChart>
          ) : (
            <LineChart
              data={visibleData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                domain={calculateDomain()}
                label={
                  yAxisLabel ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
                  } : undefined
                }
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Actual line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke={getThemeColor(1)}
                strokeWidth={2}
                dot={{
                  r: 1,
                  fill: getThemeColor(1)
                }}
                activeDot={{
                  r: 6,
                  stroke: "white",
                  strokeWidth: 2,
                  fill: getThemeColor(1),
                  filter: `url(#${theme}Glow)`
                }}
              />

              {/* AI Prediction line */}
              {showPredictions && (
                <Line
                  type="monotone"
                  dataKey="aiPrediction"
                  stroke={getThemeColor(0.7)}
                  strokeDasharray="5 3"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: "white",
                    strokeWidth: 1,
                    fill: getThemeColor(0.7)
                  }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* AI Insights Panel */}
        {showInsights && (
          <AnimatePresence>
            {insightPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 right-0 w-full sm:w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-3 z-10"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Brain size={14} className={`text-${theme}-500`} />
                    <span className="text-sm font-medium">AI Insight</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                    onClick={() => setInsightPanelOpen(false)}
                  >
                    ✕
                  </Button>
                </div>

                {highlightedInsight && (
                  <div>
                    <div className={`flex items-center gap-1.5 mb-2 text-${
                      highlightedInsight.type === "positive" ? "emerald" :
                      highlightedInsight.type === "negative" ? "red" :
                      highlightedInsight.type === "warning" ? "amber" :
                      "white"
                    }-500`}>
                      {getInsightIcon(highlightedInsight.type)}
                      <span className="font-medium">{highlightedInsight.title}</span>
                    </div>
                    <p className="text-sm text-white/70">{highlightedInsight.description}</p>
                  </div>
                )}

                <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1.5 text-white/60 hover:text-white"
                  >
                    <Lightbulb size={12} />
                    <span>View All Insights</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1.5 text-white/60 hover:text-white"
                  >
                    <ExternalLink size={12} />
                    <span>Full Analysis</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* AI insights toggle */}
      {showInsights && !insightPanelOpen && (
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs flex items-center gap-1.5 rounded-full px-3 py-1 h-auto
              ${insightPanelOpen
                ? `bg-${theme}-500/20 text-${theme}-500 hover:bg-${theme}-500/30`
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            onClick={() => setInsightPanelOpen(!insightPanelOpen)}
          >
            <Sparkles size={12} className={`text-${theme}-500`} />
            <span>AI Insights</span>
            <ChevronDown size={12} className={insightPanelOpen ? "rotate-180 transform" : ""} />
          </Button>
        </div>
      )}

      {/* Chart legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-white/60">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-current rounded-full"></div>
          <span>Actual Value</span>
        </div>

        {showPredictions && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-current rounded-full" style={{ borderBottom: `1px dashed currentColor` }}></div>
            <span>AI Prediction</span>
          </div>
        )}

        {showInsights && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAccentColor("neutral") }}></div>
            <span>AI Insights</span>
          </div>
        )}
      </div>
    </div>
  );
}
