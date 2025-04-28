import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  LineChart,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  ChevronDown,
  Zap,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  Wallet
} from "lucide-react";
import { AICard, AICardInsightBadge } from "@/components/ui/ai-card";
import { AIEnhancedChart } from "@/components/charts/AIEnhancedChart";
import { AIProcessingVisualizer } from "@/components/ai/AIProcessingVisualizer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useProcessorProgress } from "@/hooks/useProcessorProgress";

// Simple error boundary component for handling rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Mock data for the dashboard
const mockPerformanceData = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (30 - i));

  // Create a somewhat realistic pattern with some randomness
  const baseValue = 10000 + i * 50; // Steadily increasing base
  const randomFactor = Math.random() * 200 - 100; // Random fluctuation
  const value = baseValue + randomFactor;

  // Create AI predictions that are generally optimistic but realistic
  const aiPrediction = i < 25 ? null : value * (1 + (Math.random() * 0.05 + 0.01));
  const aiLowerBound = i < 25 ? null : aiPrediction * 0.97;
  const aiUpperBound = i < 25 ? null : aiPrediction * 1.03;

  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value,
    aiPrediction,
    aiLowerBound,
    aiUpperBound
  };
});

// Mock insights data
const mockInsights = [
  {
    id: 1,
    type: "success",
    title: "Yield optimization increased returns by 12.3%",
    description: "Our AI has automatically reallocated assets to higher-performing vaults, resulting in significantly improved returns compared to the baseline strategy.",
    timestamp: "2h ago",
    priority: "high",
    icon: <Sparkles size={18} className="text-emerald-500" />
  },
  {
    id: 2,
    type: "info",
    title: "Market volatility analysis completed",
    description: "AI has analyzed recent market conditions and adjusted risk parameters. Your portfolio remains well-positioned despite increased volatility in the wider market.",
    timestamp: "6h ago",
    priority: "medium",
    icon: <Brain size={18} className="text-nova" />
  },
  {
    id: 3,
    type: "warning",
    title: "Risk level change detected",
    description: "A moderate increase in risk was detected in the Orion-based vaults. AI has adjusted allocation slightly to maintain your preferred risk profile.",
    timestamp: "1d ago",
    priority: "medium",
    icon: <AlertTriangle size={18} className="text-orion" />
  },
  {
    id: 4,
    type: "info",
    title: "New yield opportunity identified",
    description: "Our AI has identified a new high-potential yield opportunity that matches your risk profile. Consider adding DEEP-SUI to your portfolio.",
    timestamp: "1d ago",
    priority: "low",
    icon: <TrendingUp size={18} className="text-nova" />
  }
];

// Risk levels data
const riskLevels = [
  { name: "Low", color: "emerald", percentage: 20 },
  { name: "Medium", color: "orion", percentage: 50 },
  { name: "High", color: "nova", percentage: 30 }
];

// Asset allocation data
const assetAllocation = [
  { name: "USDC", percentage: 35, color: "bg-blue-500" },
  { name: "SUI", percentage: 25, color: "bg-indigo-500" },
  { name: "CETUS", percentage: 20, color: "bg-purple-500" },
  { name: "Other", percentage: 20, color: "bg-gray-500" }
];

// Mock actions performed by AI
const aiActions = [
  {
    id: 1,
    action: "Rebalanced portfolio",
    detail: "Optimized asset allocation to increase yield by 2.1%",
    timestamp: "2h ago",
    impact: "+$123.45",
    status: "success"
  },
  {
    id: 2,
    action: "Risk mitigation",
    detail: "Reduced exposure to volatile assets during market fluctuation",
    timestamp: "1d ago",
    impact: "Risk -12%",
    status: "success"
  },
  {
    id: 3,
    action: "Fee optimization",
    detail: "Routed transactions through most efficient paths",
    timestamp: "2d ago",
    impact: "Saved $27.80",
    status: "success"
  },
  {
    id: 4,
    action: "Yield strategy update",
    detail: "Updated lending strategy based on interest rate trends",
    timestamp: "3d ago",
    impact: "+0.8% APR",
    status: "success"
  }
];

// UI Component
export function AIInsightsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState("1M");
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Use our custom processor progress hook for better stability
  const {
    state: processorState,
    progress: processingProgress,
    restart: restartProcessor,
    isComplete,
    isProcessing
  } = useProcessorProgress({
    initialState: 'analyzing',
    initialProgress: 0,
    speed: 1,
    onComplete: () => {
      toast({
        title: "AI Analysis Complete",
        description: "New insights and optimization strategies are available",
        duration: 3000,
      });
    }
  });

  // Simulate loading state with reduced timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduced time for better UX

    return () => clearTimeout(timer);
  }, []);

  // Memoize mock data to prevent unnecessary recalculations
  const memoizedPerformanceData = useMemo(() => mockPerformanceData, []);
  const memoizedInsights = useMemo(() => mockInsights, []);
  const memoizedAiActions = useMemo(() => aiActions, []);

  // Display insights based on showAll state using memoized data
  const displayedInsights = showAllInsights ? memoizedInsights : memoizedInsights.slice(0, 2);

  // Show loading state when data is being prepared
  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-t-nova border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="text-white/60 text-sm font-medium">Loading AI Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section with AI status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="text-nova" size={24} />
            <span>AI Dashboard</span>
          </h2>
          <p className="text-white/60 mt-1">
            Advanced insights and automated optimization of your yield strategy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-black/20 border-white/10 hover:bg-white/5"
            onClick={restartProcessor}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Analysis
          </Button>

          <Button
            className="bg-gradient-to-r from-nova-600 to-nova-500 hover:from-nova-500 hover:to-nova-400"
          >
            <span>Apply AI Recommendations</span>
            <Sparkles size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Main dashboard content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/20 border border-white/10 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
          >
            <BarChart3 size={16} className="mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
          >
            <Brain size={16} className="mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/60"
          >
            <LineChart size={16} className="mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <AICard
              className="lg:col-span-2"
              title="Portfolio Performance"
              subtitle="AI-optimized yield strategy results"
              icon={<LineChart size={18} className="text-nova" />}
              gradient="nova"
              glowEffect={true}
              headerAction={
                <div className="flex items-center text-xs text-white/60">
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: 5m ago</span>
                </div>
              }
              aiEnhanced={true}
              aiTag="AI Forecasting"
            >
              <ErrorBoundary
                fallback={
                  <div className="p-4 bg-black/30 rounded-lg border border-white/10 text-center">
                    <AlertTriangle className="mx-auto mb-2 text-orange-500" size={24} />
                    <h4 className="text-white font-medium">Chart Visualization Error</h4>
                    <p className="text-sm text-white/70 mt-1">
                      We encountered an issue rendering this chart. Please refresh the dashboard.
                    </p>
                  </div>
                }
              >
                <AIEnhancedChart
                  data={memoizedPerformanceData}
                  chartType="area"
                  theme="nova"
                  showPredictions={true}
                  showInsights={true}
                  animated={true}
                  title="Portfolio Value"
                  timeRange={activeTimeRange}
                  onTimeRangeChange={setActiveTimeRange}
                  valueUnit="$"
                  showComparison={true}
                  comparisonPercentage={11.4}
                />
              </ErrorBoundary>
            </AICard>

            {/* AI Processing Visualizer */}
            <AICard
              title="AI Neural Processor"
              subtitle="Real-time optimization engine"
              icon={<Brain size={18} className="text-nova" />}
              gradient="nova"
              aiEnhanced={true}
              aiTag="Active Processing"
              glowEffect={processorState !== "idle"}
            >
              <div className="space-y-4">
                <AIProcessingVisualizer
                  gridSize={8}
                  theme="nova"
                  state={processorState}
                  progress={processingProgress}
                  showMetrics={true}
                  className="mb-4"
                  speed={1.5} // Reduce animation speed for better performance
                />

                {processorState === "complete" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 rounded-lg bg-emerald/10 border border-emerald/20 text-sm text-white"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald">Analysis Complete</p>
                        <p className="text-white/70 text-xs mt-1">AI has generated new insights and optimization strategies for your portfolio.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {processorState === "error" && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-500">Processing Error</p>
                        <p className="text-white/70 text-xs mt-1">An error occurred during analysis. Please try again.</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      onClick={restartProcessor}
                    >
                      <RefreshCw size={14} className="mr-2" />
                      Retry Analysis
                    </Button>
                  </div>
                )}
              </div>
            </AICard>

            {/* Risk Allocation */}
            <AICard
              title="Risk Allocation"
              subtitle="AI-managed risk profile"
              icon={<AlertCircle size={18} className="text-orion" />}
              gradient="orion"
              footer={
                <div className="w-full flex items-center justify-between text-xs">
                  <span className="text-white/60">Risk Score:</span>
                  <span className="font-medium text-white">68/100</span>
                </div>
              }
              aiEnhanced={true}
              aiTag="Risk Management"
            >
              <div className="space-y-4">
                {riskLevels.map((level) => (
                  <div key={level.name} className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full bg-${level.color}`} />
                        <span className="text-sm text-white/80">{level.name} Risk</span>
                      </div>
                      <span className="text-sm font-mono">{level.percentage}%</span>
                    </div>
                    <Progress
                      value={level.percentage}
                      className={`h-1.5 bg-white/5 ${
                        level.color === "nova"
                          ? "bg-gradient-to-r from-orange-600 to-amber-500"
                          : level.color === "orion"
                          ? "bg-gradient-to-r from-amber-600 to-yellow-500"
                          : "bg-gradient-to-r from-emerald to-green-500"
                      }`}
                    />
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Current Strategy:</span>
                    <span className="text-white font-medium">Balanced Growth</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Brain size={14} className="text-orion" />
                      <span>Adjust Risk Tolerance</span>
                    </div>
                  </Button>
                </div>
              </div>
            </AICard>

            {/* Asset Allocation */}
            <AICard
              title="Asset Allocation"
              subtitle="Current portfolio distribution"
              icon={<Wallet size={18} className="text-emerald" />}
              gradient="emerald"
              aiEnhanced={true}
              aiTag="Optimized"
              headerAction={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs hover:bg-white/5 text-white/60 hover:text-white"
                >
                  <ArrowUpRight size={14} className="mr-1" />
                  Details
                </Button>
              }
            >
              <div className="space-y-4">
                {/* Asset distribution visual */}
                <div className="grid grid-cols-10 gap-1 h-4 rounded-full overflow-hidden">
                  {assetAllocation.map((asset, i) => (
                    <div
                      key={asset.name}
                      className={`${asset.color} col-span-${Math.max(1, Math.round(asset.percentage / 10))}`}
                    />
                  ))}
                </div>

                {/* Asset legend */}
                <div className="grid grid-cols-2 gap-3">
                  {assetAllocation.map((asset) => (
                    <div key={asset.name} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-white/70">{asset.name}</span>
                        <span className="text-xs font-medium">{asset.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">AI Recommendation:</span>
                    <span className="text-emerald">Allocation Optimal</span>
                  </div>
                </div>
              </div>
            </AICard>

            {/* AI Actions */}
            <AICard
              title="Recent AI Actions"
              subtitle="Automated optimizations performed"
              icon={<Zap size={18} className="text-nova" />}
              gradient="nova"
              className="lg:col-span-2"
              aiEnhanced={true}
              aiTag="Automatic"
              footer={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs hover:bg-white/5 text-white/60 hover:text-white"
                >
                  View All Actions <ChevronRight size={14} className="ml-1" />
                </Button>
              }
            >
              <div className="space-y-3">
                {memoizedAiActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="mt-1 bg-nova/10 rounded-full p-1.5">
                      {action.status === "success" ? (
                        <CheckCircle size={14} className="text-emerald" />
                      ) : (
                        <RefreshCw size={14} className="text-orion animate-spin" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-white">{action.action}</h4>
                        <span className="text-xs text-white/50 whitespace-nowrap ml-2">{action.timestamp}</span>
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">{action.detail}</p>
                    </div>

                    <div className="text-xs font-medium text-emerald whitespace-nowrap">
                      {action.impact}
                    </div>
                  </div>
                ))}
              </div>
            </AICard>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-6">
          <div className="space-y-4">
            {displayedInsights.map((insight) => (
              <AICard
                key={insight.id}
                gradient={
                  insight.type === "success" ? "emerald" :
                  insight.type === "warning" ? "orion" : "nova"
                }
                glowEffect={insight.priority === "high"}
                borderIndicator={true}
                icon={insight.icon}
                clickable
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-medium">{insight.title}</h3>
                    <AICardInsightBadge
                      type={
                        insight.type === "success" ? "success" :
                        insight.type === "warning" ? "warning" :
                        insight.type === "info" ? "info" : "alert"
                      }
                    >
                      {insight.type === "success" ? "Opportunity" :
                       insight.type === "warning" ? "Caution" : "Insight"}
                    </AICardInsightBadge>
                  </div>

                  <p className="text-white/70 text-sm">{insight.description}</p>

                  <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3">
                    <div className="text-xs text-white/50">
                      {insight.timestamp}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 hover:bg-white/5 text-white/70 hover:text-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>View Details</span>
                        <ArrowRight size={12} />
                      </div>
                    </Button>
                  </div>
                </div>
              </AICard>
            ))}

            {!showAllInsights && mockInsights.length > 2 && (
              <Button
                variant="outline"
                className="w-full mt-2 border-white/10 bg-white/5 hover:bg-white/10"
                onClick={() => setShowAllInsights(true)}
              >
                <div className="flex items-center gap-1.5">
                  <span>Show More Insights</span>
                  <ChevronDown size={14} />
                </div>
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6">
          <AICard
            title="Detailed Performance Analysis"
            subtitle="AI-enhanced metrics and forecasting"
            icon={<LineChart size={18} className="text-nova" />}
            gradient="nova"
            glowEffect={true}
            aiEnhanced={true}
          >
            <div className="h-80">
              <ErrorBoundary
                fallback={
                  <div className="h-80 flex items-center justify-center bg-black/30 rounded-lg border border-white/10">
                    <div className="text-center p-4">
                      <AlertTriangle className="mx-auto mb-2 text-orange-500" size={24} />
                      <h4 className="text-white font-medium">Chart Visualization Error</h4>
                      <p className="text-sm text-white/70 mt-1">
                        We encountered an issue rendering this chart.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="mr-2" size={14} />
                        Refresh Dashboard
                      </Button>
                    </div>
                  </div>
                }
              >
                <AIEnhancedChart
                  data={memoizedPerformanceData}
                  chartType="area"
                  theme="nova"
                  showPredictions={true}
                  showInsights={true}
                  animated={true}
                  title="Portfolio Value Over Time"
                  timeRange={activeTimeRange}
                  onTimeRangeChange={setActiveTimeRange}
                  valueUnit="$"
                  showComparison={true}
                  comparisonPercentage={11.4}
                  className="h-full"
                />
              </ErrorBoundary>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                <div className="text-xs text-white/60 mb-1">Total Value</div>
                <div className="text-xl font-mono font-medium text-white">$11,431.28</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald">
                  <TrendingUp size={12} />
                  <span>+11.4% from initial</span>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                <div className="text-xs text-white/60 mb-1">AI Optimized Gain</div>
                <div className="text-xl font-mono font-medium text-white">+$432.58</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald">
                  <Sparkles size={12} />
                  <span>+4.3% additional yield</span>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                <div className="text-xs text-white/60 mb-1">Projected Annual</div>
                <div className="text-xl font-mono font-medium text-white">$13,986.12</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-nova">
                  <Brain size={12} />
                  <span>AI forecasted value</span>
                </div>
              </div>
            </div>
          </AICard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
