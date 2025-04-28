import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  LineChart,
  BarChart3,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

/**
 * A simplified, robust version of the AI Dashboard
 * This version has minimal dependencies and animations to ensure stability
 */
export function SimplifiedAIInsightsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setDataLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-nova border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-white/70">Loading AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Tab buttons */}
      <div className="flex border border-white/10 bg-black/20 rounded-lg p-1 mb-6">
        <TabButton
          active={selectedTab === "overview"}
          onClick={() => setSelectedTab("overview")}
          icon={<BarChart3 size={16} />}
          label="Overview"
        />
        <TabButton
          active={selectedTab === "insights"}
          onClick={() => setSelectedTab("insights")}
          icon={<Brain size={16} />}
          label="AI Insights"
        />
        <TabButton
          active={selectedTab === "performance"}
          onClick={() => setSelectedTab("performance")}
          icon={<LineChart size={16} />}
          label="Performance"
        />
      </div>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main chart card */}
        <Card
          title="Portfolio Performance"
          subtitle="AI-optimized yield strategy"
          className="lg:col-span-2"
          gradient="nova"
        >
          <div className="bg-black/20 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart size={32} className="text-nova/50 mx-auto mb-2" />
              <p className="text-white/70">Portfolio performance visualization</p>
              <p className="text-white/50 text-sm">+11.4% from initial investment</p>
            </div>
          </div>
        </Card>

        {/* AI Neural processor */}
        <Card
          title="AI Neural Processor"
          subtitle="Real-time optimization engine"
          gradient="nova"
        >
          <div className="bg-black/20 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-center p-4">
              <Brain size={32} className="text-nova/50 mx-auto mb-2" />
              <p className="text-white/70">Analysis in progress</p>
              <p className="text-white/50 text-sm">Optimizing your portfolio</p>
            </div>
          </div>
        </Card>

        {/* Risk allocation */}
        <Card
          title="Risk Allocation"
          subtitle="AI-managed risk profile"
          gradient="orion"
        >
          <div className="space-y-4 p-4">
            {["Low", "Medium", "High"].map((risk, i) => (
              <div key={risk} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">{risk} Risk</span>
                  <span className="text-sm">{[20, 50, 30][i]}%</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      risk === "Low" ? "bg-emerald-500" :
                      risk === "Medium" ? "bg-orion" : "bg-nova"
                    }`}
                    style={{ width: `${[20, 50, 30][i]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Asset allocation */}
        <Card
          title="Asset Allocation"
          subtitle="Current portfolio distribution"
          gradient="emerald"
        >
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-10 gap-1 h-4 rounded-full overflow-hidden">
              <div className="col-span-4 bg-blue-500"></div>
              <div className="col-span-3 bg-indigo-500"></div>
              <div className="col-span-2 bg-purple-500"></div>
              <div className="col-span-1 bg-gray-500"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "USDC", percent: "40%", color: "bg-blue-500" },
                { name: "SUI", percent: "30%", color: "bg-indigo-500" },
                { name: "CETUS", percent: "20%", color: "bg-purple-500" },
                { name: "Other", percent: "10%", color: "bg-gray-500" }
              ].map(asset => (
                <div key={asset.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${asset.color}`}></div>
                  <div className="flex justify-between w-full">
                    <span className="text-xs text-white/70">{asset.name}</span>
                    <span className="text-xs font-medium">{asset.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent AI Actions */}
        <Card
          title="Recent AI Actions"
          subtitle="Automated optimizations performed"
          gradient="nova"
          className="lg:col-span-2"
        >
          <div className="space-y-3 p-4">
            {[
              {
                action: "Rebalanced portfolio",
                detail: "Optimized asset allocation to increase yield by 2.1%",
                time: "2h ago",
                impact: "+$123.45"
              },
              {
                action: "Risk mitigation",
                detail: "Reduced exposure to volatile assets during market fluctuation",
                time: "1d ago",
                impact: "Risk -12%"
              },
              {
                action: "Fee optimization",
                detail: "Routed transactions through most efficient paths",
                time: "2d ago",
                impact: "Saved $27.80"
              }
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="mt-1 bg-nova/10 rounded-full p-1.5">
                  <Sparkles size={14} className="text-emerald-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-white">{action.action}</h4>
                    <span className="text-xs text-white/50 whitespace-nowrap ml-2">{action.time}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">{action.detail}</p>
                </div>

                <div className="text-xs font-medium text-emerald-500 whitespace-nowrap">
                  {action.impact}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Simple tab button component
function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

// Simple card component
function Card({
  children,
  title,
  subtitle,
  gradient = "none",
  className = ""
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  gradient?: "nova" | "orion" | "emerald" | "none";
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden ${
        gradient !== "none"
          ? "bg-gradient-to-br from-black/60 via-black/80 to-black/60"
          : "bg-black/30"
      } ${
        gradient === "nova"
          ? "border-l-nova"
          : gradient === "orion"
          ? "border-l-orion"
          : gradient === "emerald"
          ? "border-l-emerald"
          : ""
      } ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="p-4 border-b border-white/5">
          {title && <h3 className="text-white font-medium text-base">{title}</h3>}
          {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className={title || subtitle ? "" : "p-4"}>
        {children}
      </div>
    </div>
  );
}
