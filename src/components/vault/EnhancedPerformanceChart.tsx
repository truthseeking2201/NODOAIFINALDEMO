import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  ReferenceLine,
  Label,
  Scatter
} from "recharts";
import {
  TrendingUp,
  ChevronDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Info,
  Zap,
  ChevronRight,
  LineChart as LineChartIcon
} from "lucide-react";

interface EnhancedPerformanceChartProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  timeRange: "daily" | "weekly" | "monthly";
  onTimeRangeChange: (range: "daily" | "weekly" | "monthly") => void;
}

type DataPoint = {
  timestamp: string;
  value: number;
  aiValue: number;
  marketValue: number;
  volume: number;
  prediction?: number;
  aiAction?: string;
  confidence?: number;
};

export function EnhancedPerformanceChart({
  vaultType,
  timeRange,
  onTimeRangeChange
}: EnhancedPerformanceChartProps) {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPrediction, setShowPrediction] = useState<boolean>(true);
  const [showMarketComparison, setShowMarketComparison] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showAIActivity, setShowAIActivity] = useState<boolean>(true);
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(null);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // AI insights
  const [aiInsights, setAiInsights] = useState<string[]>([
    "Pattern suggests potential upward trend in next 24 hours",
    "Volatility decreasing - favorable for stable returns",
    "High correlation with market trend patterns from Q2 2023"
  ]);

  // Generate new AI insights based on the current data
  useEffect(() => {
    if (chartData.length > 0) {
      // Generate insights dynamically based on the current data
      const actualData = chartData.filter(point => !point.prediction);
      if (actualData.length < 2) return;

      const latest = actualData[actualData.length - 1];
      const earliest = actualData[0];
      const changePercent = ((latest.aiValue - earliest.aiValue) / earliest.aiValue) * 100;
      const marketChangePercent = ((latest.marketValue - earliest.marketValue) / earliest.marketValue) * 100;
      const outperformMarket = changePercent > marketChangePercent;

      // Generate insights based on the data
      const newInsights = [];

      if (outperformMarket) {
        newInsights.push(`AI strategy outperforming market by ${(changePercent - marketChangePercent).toFixed(2)}% in this period`);
      }

      // Check recent trend (last 5 points)
      const recentData = actualData.slice(-5);
      const recentTrend = recentData[recentData.length - 1].aiValue > recentData[0].aiValue;

      if (recentTrend) {
        newInsights.push("Recent upward trend detected - optimizing position allocations");
      } else {
        newInsights.push("Recent consolidation period - maintaining defensive positions");
      }

      // Generate a risk assessment
      const riskLevel = vaultType === 'nova' ? 'moderate-high' : vaultType === 'orion' ? 'moderate' : 'low';
      newInsights.push(`Current market risk assessment: ${riskLevel} - adjusting strategy accordingly`);

      // Add a randomized insight based on vault type
      const vaultSpecificInsights = {
        'nova': [
          "Aggressively rebalancing to capture emerging opportunities",
          "Optimizing for maximum growth with balanced risk exposure",
          "Neural predictive models suggest potential breakout in coming period"
        ],
        'orion': [
          "Balanced approach maintaining optimal risk/reward ratio",
          "Strategic diversification providing increased stability",
          "AI has detected favorable market conditions for moderate growth"
        ],
        'emerald': [
          "Conservative positioning with focus on capital preservation",
          "Optimized for stable returns with minimized volatility",
          "Risk mitigation strategies actively deployed by AI systems"
        ]
      };

      const typeInsights = vaultSpecificInsights[vaultType];
      const randomTypeInsight = typeInsights[Math.floor(Math.random() * typeInsights.length)];
      newInsights.push(randomTypeInsight);

      setAiInsights(newInsights);
    }
  }, [chartData, vaultType]);

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: '#f97316',
        secondary: '#f59e0b',
        light: 'rgba(249, 115, 22, 0.1)',
        medium: 'rgba(249, 115, 22, 0.5)',
        chart: {
          main: '#f97316',
          mainGradient: ['rgba(249, 115, 22, 0.8)', 'rgba(249, 115, 22, 0.1)'],
          secondary: '#f59e0b',
          secondaryGradient: ['rgba(245, 158, 11, 0.5)', 'rgba(245, 158, 11, 0.1)'],
          market: '#94a3b8',
          marketGradient: ['rgba(148, 163, 184, 0.5)', 'rgba(148, 163, 184, 0.1)'],
          prediction: '#fb923c',
          volume: 'rgba(249, 115, 22, 0.2)'
        },
        class: {
          primary: 'text-nova',
          bg: 'bg-nova/10',
          border: 'border-nova/20'
        }
      };
      case 'orion': return {
        primary: '#f59e0b',
        secondary: '#eab308',
        light: 'rgba(245, 158, 11, 0.1)',
        medium: 'rgba(245, 158, 11, 0.5)',
        chart: {
          main: '#f59e0b',
          mainGradient: ['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.1)'],
          secondary: '#eab308',
          secondaryGradient: ['rgba(234, 179, 8, 0.5)', 'rgba(234, 179, 8, 0.1)'],
          market: '#94a3b8',
          marketGradient: ['rgba(148, 163, 184, 0.5)', 'rgba(148, 163, 184, 0.1)'],
          prediction: '#fbbf24',
          volume: 'rgba(245, 158, 11, 0.2)'
        },
        class: {
          primary: 'text-orion',
          bg: 'bg-orion/10',
          border: 'border-orion/20'
        }
      };
      case 'emerald': return {
        primary: '#10b981',
        secondary: '#22c55e',
        light: 'rgba(16, 185, 129, 0.1)',
        medium: 'rgba(16, 185, 129, 0.5)',
        chart: {
          main: '#10b981',
          mainGradient: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.1)'],
          secondary: '#22c55e',
          secondaryGradient: ['rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.1)'],
          market: '#94a3b8',
          marketGradient: ['rgba(148, 163, 184, 0.5)', 'rgba(148, 163, 184, 0.1)'],
          prediction: '#34d399',
          volume: 'rgba(16, 185, 129, 0.2)'
        },
        class: {
          primary: 'text-emerald',
          bg: 'bg-emerald/10',
          border: 'border-emerald/20'
        }
      };
    }
  };

  const colors = getTypeColor();

  // Generate simulated data based on the vault type and time range
  useEffect(() => {
    setIsLoading(true);

    const generateData = () => {
      let data: DataPoint[] = [];
      let pointCount = 0;
      let timeIncrement = 0;
      let dateFormat = '';
      let baseValue = 0;
      let volatility = 0;

      // Determine parameters based on time range
      switch (timeRange) {
        case 'daily':
          pointCount = 24;
          timeIncrement = 60 * 60 * 1000; // 1 hour
          dateFormat = 'HH:mm';
          break;
        case 'weekly':
          pointCount = 7;
          timeIncrement = 24 * 60 * 60 * 1000; // 1 day
          dateFormat = 'ddd';
          break;
        case 'monthly':
          pointCount = 30;
          timeIncrement = 24 * 60 * 60 * 1000; // 1 day
          dateFormat = 'MMM D';
          break;
      }

      // Set base values based on vault type
      switch (vaultType) {
        case 'nova':
          baseValue = 130;
          volatility = 0.08;
          break;
        case 'orion':
          baseValue = 118;
          volatility = 0.05;
          break;
        case 'emerald':
          baseValue = 106;
          volatility = 0.02;
          break;
      }

      // Generate data points
      let currentValue = baseValue;
      let marketValue = baseValue * 0.92;
      let aiValue = baseValue;
      let now = new Date();

      for (let i = 0; i < pointCount; i++) {
        // For past data points
        let timestamp = new Date(now.getTime() - (pointCount - i - 1) * timeIncrement);

        // Vault value (slightly random with trend based on vault type)
        const change = (Math.random() * 2 - 0.7) * volatility * baseValue;
        currentValue += change;
        if (currentValue < baseValue * 0.85) currentValue = baseValue * 0.85;
        if (currentValue > baseValue * 1.4) currentValue = baseValue * 1.4;

        // Market value (slightly worse performance)
        const marketChange = (Math.random() * 1.8 - 1) * volatility * baseValue;
        marketValue += marketChange;
        if (marketValue < baseValue * 0.75) marketValue = baseValue * 0.75;
        if (marketValue > baseValue * 1.3) marketValue = baseValue * 1.3;

        // AI-optimized value (better than regular vault value after optimization)
        if (i > pointCount * 0.4) {
          const improvement = (Math.random() * 0.7 + 0.3) * volatility * baseValue;
          aiValue = currentValue + improvement;
          if (aiValue > baseValue * 1.5) aiValue = baseValue * 1.5;
        } else {
          aiValue = currentValue;
        }

        // Trading volume
        const volume = Math.floor(Math.random() * 1000) + 500;

        // AI actions (occasional events)
        let aiAction: string | undefined = undefined;
        let confidence: number | undefined = undefined;

        if (i === Math.floor(pointCount * 0.4)) {
          aiAction = "AI optimization enabled";
          confidence = 87;
        } else if (Math.random() > 0.85 && i > pointCount * 0.4) {
          const actions = ["Strategy rebalanced", "Portfolio optimized", "Risk parameters adjusted"];
          aiAction = actions[Math.floor(Math.random() * actions.length)];
          confidence = Math.floor(Math.random() * 15) + 80;
        }

        // Add data point
        data.push({
          timestamp: timestamp.toISOString(),
          value: parseFloat(currentValue.toFixed(2)),
          aiValue: parseFloat(aiValue.toFixed(2)),
          marketValue: parseFloat(marketValue.toFixed(2)),
          volume,
          aiAction,
          confidence
        });
      }

      // Add prediction points
      for (let i = 0; i < 5; i++) {
        let timestamp = new Date(now.getTime() + i * timeIncrement);

        // Predicted value (continuing trend with increasing uncertainty)
        const lastValue = data[data.length - 1].aiValue;
        const trending = (data[data.length - 1].aiValue - data[data.length - 5]?.aiValue) / 5;
        const predictedChange = trending + (Math.random() * 2 - 1) * volatility * baseValue * (1 + i * 0.2);
        const prediction = lastValue + predictedChange;

        data.push({
          timestamp: timestamp.toISOString(),
          value: 0, // No actual value for future
          aiValue: 0, // No actual AI value for future
          marketValue: 0, // No market value for future
          volume: 0,
          prediction: parseFloat(prediction.toFixed(2))
        });
      }

      return data;
    };

    // Simulate a slight loading delay
    setTimeout(() => {
      setChartData(generateData());
      setIsLoading(false);
    }, 700);
  }, [timeRange, vaultType]);

  // Format date for display based on time range
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    switch (timeRange) {
      case 'daily':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'weekly':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'monthly':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  // Format values with + sign for positive changes
  const formatChange = (value: number): string => {
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  // Helper function to dispatch AI insight events
  const dispatchAIInsightEvent = (message: string) => {
    const event = new CustomEvent('ai-insight', {
      detail: { message }
    });
    window.dispatchEvent(event);
  };

  // Get statistical data
  const getCurrentStats = () => {
    // Filter out prediction points
    const actualData = chartData.filter(point => !point.prediction);

    if (actualData.length < 2) return { change: 0, aiChange: 0, marketChange: 0 };

    const first = actualData[0];
    const last = actualData[actualData.length - 1];

    const change = ((last.value - first.value) / first.value) * 100;
    const aiChange = ((last.aiValue - first.aiValue) / first.aiValue) * 100;
    const marketChange = ((last.marketValue - first.marketValue) / first.marketValue) * 100;

    return { change, aiChange, marketChange };
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find the corresponding data point
      const dataPoint = chartData.find(point => point.timestamp === label);

      if (!dataPoint) return null;

      const isPrediction = Boolean(dataPoint.prediction);

      return (
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-xs text-white/70 mb-1">{formatDate(label)}</p>

          {isPrediction ? (
            <>
              <p className="text-sm font-medium text-white flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chart.prediction }}></span>
                Prediction: ${dataPoint.prediction?.toFixed(2)}
              </p>
              <p className="text-xs text-white/60">AI confidence: {Math.round(75 - Math.random() * 20)}%</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chart.main }}></span>
                Value: ${dataPoint.value.toFixed(2)}
              </p>
              {showAIActivity && (
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chart.secondary }}></span>
                  AI-Optimized: ${dataPoint.aiValue.toFixed(2)}
                </p>
              )}
              {showMarketComparison && (
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chart.market }}></span>
                  Market: ${dataPoint.marketValue.toFixed(2)}
                </p>
              )}
              {showVolume && (
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chart.volume }}></span>
                  Volume: {dataPoint.volume}
                </p>
              )}

              {dataPoint.aiAction && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-xs flex items-center gap-1 text-white/80">
                    <Zap size={10} style={{ color: colors.primary }} />
                    {dataPoint.aiAction}
                    {dataPoint.confidence && (
                      <span className="ml-auto text-white/60">{dataPoint.confidence}% conf.</span>
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    return null;
  };

  // Get current performance stats
  const stats = getCurrentStats();

  // Find latest datapoint
  const latestActualData = chartData.filter(point => !point.prediction).pop();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-black/20 rounded-xl border border-white/10 animate-pulse">
        <LineChartIcon size={40} className="text-white/20 mb-4" />
        <p className="text-white/50">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Chart header with stats */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Performance stats */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/60 mb-0.5">Current Value</p>
            <p className="text-xl font-mono font-medium text-white">
              ${latestActualData?.aiValue.toFixed(2)}
            </p>
            <div className={`mt-1 text-xs flex items-center gap-1 ${
              stats.aiChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.aiChange >= 0 ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {formatChange(stats.aiChange)}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/60 mb-0.5">AI Performance</p>
            <p className="text-xl font-mono font-medium" style={{ color: colors.primary }}>
              {formatChange(stats.aiChange - stats.marketChange)}
            </p>
            <p className="mt-1 text-xs text-white/60">vs. market average</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/60 mb-0.5">AI Prediction</p>
            {showPrediction ? (
              <>
                <p className="text-xl font-mono font-medium text-white">
                  ${chartData.find(point => point.prediction)?.prediction?.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-white/60">in 24 hours</p>
              </>
            ) : (
              <>
                <button
                  className="text-sm font-medium py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  onClick={() => setShowPrediction(true)}
                >
                  Show Prediction
                </button>
              </>
            )}
          </div>
        </div>

        {/* Time range controls */}
        <div className="flex items-center bg-white/5 rounded-lg p-1 h-10">
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'daily'
                ? `text-white bg-gradient-to-r from-${vaultType === 'nova' ? 'orange-600' : vaultType === 'orion' ? 'amber-600' : 'emerald'} to-${vaultType === 'nova' ? 'amber-500' : vaultType === 'orion' ? 'yellow-500' : 'green-500'}`
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange('daily')}
          >
            24H
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'weekly'
                ? `text-white bg-gradient-to-r from-${vaultType === 'nova' ? 'orange-600' : vaultType === 'orion' ? 'amber-600' : 'emerald'} to-${vaultType === 'nova' ? 'amber-500' : vaultType === 'orion' ? 'yellow-500' : 'green-500'}`
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange('weekly')}
          >
            7D
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'monthly'
                ? `text-white bg-gradient-to-r from-${vaultType === 'nova' ? 'orange-600' : vaultType === 'orion' ? 'amber-600' : 'emerald'} to-${vaultType === 'nova' ? 'amber-500' : vaultType === 'orion' ? 'yellow-500' : 'green-500'}`
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
            onClick={() => onTimeRangeChange('monthly')}
          >
            30D
          </button>
        </div>
      </div>

      {/* Display options */}
      <div className="flex flex-wrap gap-2" id="chart-controls">
        <button
          className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
            showAIActivity
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
          onClick={() => {
            // Toggle AI Optimization visibility
            setShowAIActivity(!showAIActivity);
            const newState = !showAIActivity;

            // Provide feedback to user
            const message = newState
              ? "AI Optimization data now visible on chart"
              : "AI Optimization data hidden";

            dispatchAIInsightEvent(message);
          }}
          data-control="ai-optimization"
        >
          {showAIActivity ? <Eye size={12} /> : <EyeOff size={12} />}
          AI Optimization
        </button>

        <button
          className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
            showMarketComparison
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
          onClick={() => {
            // Toggle Market Comparison visibility
            setShowMarketComparison(!showMarketComparison);
            const newState = !showMarketComparison;

            // Provide feedback to user
            const message = newState
              ? "Market Comparison data now visible on chart"
              : "Market Comparison data hidden";

            dispatchAIInsightEvent(message);
          }}
          data-control="market-comparison"
        >
          {showMarketComparison ? <Eye size={12} /> : <EyeOff size={12} />}
          Market Comparison
        </button>

        <button
          className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
            showPrediction
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
          onClick={() => {
            // Toggle Prediction visibility
            setShowPrediction(!showPrediction);
            const newState = !showPrediction;

            // Provide feedback to user
            const message = newState
              ? "AI Prediction data now visible on chart"
              : "AI Prediction data hidden";

            dispatchAIInsightEvent(message);
          }}
          data-control="prediction"
        >
          {showPrediction ? <Eye size={12} /> : <EyeOff size={12} />}
          Prediction
        </button>

        <button
          className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
            showVolume
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
          onClick={() => {
            // Toggle Volume visibility
            setShowVolume(!showVolume);
            const newState = !showVolume;

            // Provide feedback to user
            const message = newState
              ? "Trading Volume data now visible on chart"
              : "Trading Volume data hidden";

            dispatchAIInsightEvent(message);
          }}
          data-control="volume"
        >
          {showVolume ? <Eye size={12} /> : <EyeOff size={12} />}
          Volume
        </button>

        <button
          className={`ml-auto text-xs px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors
            ${showAdvancedPanel ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}
          `}
          onClick={() => {
            // Toggle AI Insights panel
            setShowAdvancedPanel(!showAdvancedPanel);
            const newState = !showAdvancedPanel;

            // Provide feedback to user
            const message = newState
              ? "AI Insights panel opened"
              : "AI Insights panel closed";

            dispatchAIInsightEvent(message);
          }}
          data-control="show-ai-insights"
        >
          {showAdvancedPanel ? 'Hide AI Insights' : 'Show AI Insights'}
          <ChevronDown
            size={12}
            className="transition-transform duration-200"
            style={{ transform: showAdvancedPanel ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {/* Main chart */}
      <div
        className="relative bg-black/20 rounded-xl border border-white/10 p-4 transition-all duration-300"
        style={{ height: showAdvancedPanel ? '440px' : '300px' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Chart container */}
        <ResponsiveContainer width="100%" height={showAdvancedPanel ? 300 : 280}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 15 }}
            onMouseMove={(data) => {
              if (data.activePayload && data.activePayload.length) {
                const timestamp = data.activePayload[0].payload.timestamp;
                const point = chartData.find(p => p.timestamp === timestamp);
                if (point) setSelectedDataPoint(point);
              }
            }}
            onMouseLeave={() => setSelectedDataPoint(null)}
          >
            <defs>
              {/* Gradients for line chart */}
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.chart.main} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.chart.main} stopOpacity={0.1}/>
              </linearGradient>

              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.chart.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.chart.secondary} stopOpacity={0.1}/>
              </linearGradient>

              <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.chart.market} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.chart.market} stopOpacity={0.1}/>
              </linearGradient>

              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.chart.prediction} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.chart.prediction} stopOpacity={0.1}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => `$${value}`}
              width={45}
            />
            {/* Add secondary Y-axis for volume data */}
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                domain={['dataMin', 'dataMax + 100']}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={(value) => `${value}`}
                width={40}
              />
            )}
            <Tooltip content={<CustomTooltip />} />

            {/* Draw a vertical line separating actual and predicted data */}
            {showPrediction && (
              <ReferenceLine
                x={chartData.find(point => point.prediction)?.timestamp}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="3 3"
                label={{ value: 'Now', position: 'insideBottomRight', fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
            )}

            {/* Market comparison line */}
            {showMarketComparison && (
              <Line
                type="monotone"
                dataKey="marketValue"
                stroke={colors.chart.market}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: colors.chart.market }}
                connectNulls={true}
              />
            )}

            {/* Base value line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.chart.main}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: colors.chart.main }}
              connectNulls={true}
            />

            {/* AI optimized line */}
            {showAIActivity && (
              <Line
                type="monotone"
                dataKey="aiValue"
                stroke={colors.chart.secondary}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: colors.chart.secondary }}
                connectNulls={true}
              />
            )}

            {/* Volume bars */}
            {showVolume && (
              <Bar
                dataKey="volume"
                barSize={20}
                fill={colors.chart.volume}
                yAxisId="volume"
                opacity={0.6}
              />
            )}

            {/* Prediction line */}
            {showPrediction && (
              <Line
                type="monotone"
                dataKey="prediction"
                stroke={colors.chart.prediction}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 5, fill: colors.chart.prediction }}
                connectNulls={true}
              />
            )}

            {/* AI action scatter points */}
            <Scatter
              dataKey="aiAction"
              data={chartData.filter(point => point.aiAction)}
              shape={() => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="7" fill={colors.light} />
                  <circle cx="11" cy="11" r="5" fill={colors.medium} />
                  <circle cx="11" cy="11" r="3" fill={colors.primary} />
                </svg>
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* AI Actions timeline */}
        <div className="absolute bottom-2 left-0 right-0 px-4">
          <div className="w-full h-5 relative">
            {chartData
              .filter(point => point.aiAction)
              .map((point, index) => {
                // Calculate position based on timestamp
                const firstTimestamp = new Date(chartData[0].timestamp).getTime();
                const lastTimestamp = new Date(chartData[chartData.length - 6].timestamp).getTime(); // Exclude prediction points
                const pointTimestamp = new Date(point.timestamp).getTime();

                const position = ((pointTimestamp - firstTimestamp) / (lastTimestamp - firstTimestamp)) * 100;

                return (
                  <div
                    key={index}
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${colors.class.bg}`}
                      style={{ backgroundColor: colors.primary }}
                    ></div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* AI insights panel */}
        <AnimatePresence>
          {showAdvancedPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 pt-3 border-t border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${colors.class.bg}`}>
                  <Brain size={14} className={colors.class.primary} />
                </div>
                <h3 className="text-sm font-medium text-white">AI Insights</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: colors.primary }}></div>
                      </div>
                      <div className="text-xs text-white/80">{insight}</div>
                    </div>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                className="mt-3 text-right"
              >
                <button className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 ml-auto">
                  View Advanced Analytics
                  <ChevronRight size={10} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
