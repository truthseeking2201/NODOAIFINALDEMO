import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  BarChart2,
  LineChart,
  Lightbulb,
  Cpu,
  Shield,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Insight {
  id: string;
  title: string;
  description: string;
  plainLanguage: string;
  benefit: string;
  metric?: {
    value: string;
    change: number;
    label: string;
  };
  type: 'performance' | 'market' | 'risk' | 'optimization';
  chart?: string; // This would be either a simple chart SVG or a reference to a chart component
}

export function AIInsightsModule() {
  const [insights] = useState<Insight[]>(generateInsights());
  const [activeInsight, setActiveInsight] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Auto-rotate the insights
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [insights.length, autoplay]);

  // Generate mock insights data
  function generateInsights(): Insight[] {
    return [
      {
        id: "insight-1",
        title: "APR Optimization",
        description: "Neural models have increased average vault APR by 2.4% over the past 30 days through dynamic rebalancing and position optimization.",
        plainLanguage: "We adjusted your investments to earn higher returns",
        benefit: "Your money is working harder for you with minimal effort on your part",
        metric: {
          value: "+2.4%",
          change: 2.4,
          label: "APR Increase"
        },
        type: 'performance',
        chart: `<svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40L5 35L10 37L15 33L20 36L25 32L30 34L35 30L40 28L45 25L50 27L55 23L60 25L65 22L70 18L75 20L80 16L85 12L90 8L95 5L100 0" stroke="#F97316" strokeWidth="2" fill="none" />
          <path d="M0 40L5 35L10 37L15 33L20 36L25 32L30 34L35 30L40 28L45 25L50 27L55 23L60 25L65 22L70 18L75 20L80 16L85 12L90 8L95 5L100 0" stroke="url(#paint0_linear)" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="40" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" stopOpacity="0" />
              <stop offset="1" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>`
      },
      {
        id: "insight-2",
        title: "Risk Management",
        description: "AI safeguards actively protected vaults from 3 major market volatility events last week, preventing potential losses of 1.8%.",
        plainLanguage: "We protected your investment from recent market drops",
        benefit: "You avoided losing 1.8% of your investment value during market volatility",
        metric: {
          value: "-1.8%",
          change: -1.8,
          label: "Loss Prevention"
        },
        type: 'risk',
        chart: `<svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10L5 12L10 8L15 15L20 13L25 18L30 10L35 22L40 20L45 15L50 18L55 10L60 16L65 9L70 20L75 15L80 18L85 10L90 14L95 10L100 12" stroke="#10B981" strokeWidth="2" fill="none" />
          <path d="M0 10L5 12L10 8L15 15L20 13L25 18L30 10L35 22L40 20L45 15L50 18L55 10L60 16L65 9L70 20L75 15L80 18L85 10L90 14L95 10L100 12" stroke="url(#paint0_linear)" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="10" x2="100" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" stopOpacity="0" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>`
      },
      {
        id: "insight-3",
        title: "Market Analysis",
        description: "Neural networks analyzed 3.2M on-chain data points to predict optimal entry points, achieving 94.3% accuracy in price movement predictions.",
        plainLanguage: "We found the best times to enter and exit market positions",
        benefit: "Your investments are timed to maximize your returns with high precision",
        metric: {
          value: "94.3%",
          change: 94.3,
          label: "Prediction Accuracy"
        },
        type: 'market',
        chart: `<svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30L5 28L10 25L15 27L20 25L25 23L30 24L35 20L40 21L45 22L50 18L55 19L60 20L65 17L70 16L75 15L80 14L85 12L90 10L95 8L100 5" stroke="#F59E0B" strokeWidth="2" fill="none" />
          <path d="M0 30L5 28L10 25L15 27L20 25L25 23L30 24L35 20L40 21L45 22L50 18L55 19L60 20L65 17L70 16L75 15L80 14L85 12L90 10L95 8L100 5" stroke="url(#paint0_linear)" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="30" x2="100" y2="5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>`
      },
      {
        id: "insight-4",
        title: "Position Optimization",
        description: "Deep learning algorithms detected inefficient liquidity provisioning and automatically rebalanced positions for 18.7% better capital utilization.",
        plainLanguage: "We adjusted your investment allocations for better efficiency",
        benefit: "Your capital is now 18.7% more productive, maximizing your potential returns",
        metric: {
          value: "+18.7%",
          change: 18.7,
          label: "Capital Efficiency"
        },
        type: 'optimization',
        chart: `<svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 35L5 33L10 30L15 32L20 28L25 30L30 25L35 27L40 22L45 24L50 20L55 18L60 15L65 17L70 13L75 15L80 10L85 8L90 5L95 7L100 2" stroke="#F97316" strokeWidth="2" fill="none" />
          <path d="M0 35L5 33L10 30L15 32L20 28L25 30L30 25L35 27L40 22L45 24L50 20L55 18L60 15L65 17L70 13L75 15L80 10L85 8L90 5L95 7L100 2" stroke="url(#paint0_linear)" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="35" x2="100" y2="2" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" stopOpacity="0" />
              <stop offset="1" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>`
      }
    ];
  }

  function getInsightIcon(type: string) {
    switch (type) {
      case 'performance':
        return <TrendingUp size={18} className="text-nova" />;
      case 'market':
        return <BarChart2 size={18} className="text-orion" />;
      case 'risk':
        return <Shield size={18} className="text-emerald" />;
      case 'optimization':
        return <Cpu size={18} className="text-nova" />;
      default:
        return <Lightbulb size={18} className="text-white" />;
    }
  }

  function getMetricColor(change: number) {
    if (change > 0) {
      return "text-emerald drop-shadow-glow-green";
    } else if (change < 0) {
      return "text-red-500 drop-shadow-glow-red";
    }
    return "text-white";
  }

  function handlePrev() {
    setAutoplay(false);
    setActiveInsight((prev) => (prev === 0 ? insights.length - 1 : prev - 1));
  }

  function handleNext() {
    setAutoplay(false);
    setActiveInsight((prev) => (prev + 1) % insights.length);
  }

  return (
    <div className="my-10 max-w-screen-xl mx-auto relative">
      {/* Background glow effect - more subtle */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-nova/5 blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-orion/5 blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-nova/20 to-nova/5 shadow-md">
              <Brain size={20} className="text-nova" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-0.5">AI-Powered Insights</h2>
            <p className="text-sm text-white/70">Helping your investments work smarter</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
          >
            <ChevronLeft size={18} className="text-white/70" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
          >
            <ChevronRight size={18} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Simple indicator line */}
      <div className="relative mb-4 h-1">
        <motion.div
          className="absolute inset-0 h-0.5 bg-gradient-to-r from-transparent via-nova/50 to-transparent rounded-full overflow-hidden"
          animate={{
            scaleX: [0.5, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {insights.map((insight, index) => (
            index === activeInsight && (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Card className="w-full bg-gradient-to-b from-black/40 via-black/50 to-black/70 border-white/10 backdrop-blur-md overflow-hidden rounded-xl">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-6">

                      {/* Left side - User-friendly explanation */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-nova/20 to-nova/5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-white/60 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-nova animate-pulse"></div>
                              Recent Activity
                            </div>
                            <h3 className="text-xl font-bold">{insight.title}</h3>
                          </div>
                          {insight.metric && (
                            <div className="flex flex-col items-end text-right">
                              <div className="text-xs text-white/60">{insight.metric.label}</div>
                              <div className={`text-2xl font-bold font-mono ${getMetricColor(insight.metric.change)}`}>
                                {insight.metric.value}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Simple explanation */}
                          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                            <h4 className="text-white font-medium mb-1 flex items-center gap-1.5">
                              <Lightbulb size={14} className="text-orion" />
                              What happened
                            </h4>
                            <p className="text-white/90 text-sm">{insight.plainLanguage}</p>
                          </div>

                          {/* User benefit */}
                          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                            <h4 className="text-white font-medium mb-1 flex items-center gap-1.5">
                              <DollarSign size={14} className="text-emerald" />
                              How you benefit
                            </h4>
                            <p className="text-white/90 text-sm">{insight.benefit}</p>
                          </div>

                          {/* Recent update timestamp */}
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Clock size={12} />
                            <span>Updated recently</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Chart visualization */}
                      <div className="md:w-1/3 lg:w-2/5 flex flex-col">
                        <div className="h-32 md:h-full min-h-[120px] flex items-center justify-center bg-gradient-to-b from-black/40 to-black/60 rounded-lg border border-white/5 p-3">
                          {insight.chart && (
                            <motion.div
                              initial={{ opacity: 0.7 }}
                              animate={{ opacity: [0.7, 1, 0.8] }}
                              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                              className="w-full h-full flex items-center justify-center"
                              dangerouslySetInnerHTML={{ __html: insight.chart }}
                            />
                          )}
                        </div>
                        <div className="text-xs text-white/50 text-center mt-2">
                          {insight.type === 'performance' && 'APR Performance (30 days)'}
                          {insight.type === 'market' && 'Prediction Accuracy (30 days)'}
                          {insight.type === 'risk' && 'Protected Value (7 days)'}
                          {insight.type === 'optimization' && 'Capital Efficiency Gains (30 days)'}
                        </div>
                      </div>
                    </div>

                    {/* Technical details accordion */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <button
                        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                        className="w-full flex items-center justify-between text-white/60 hover:text-white/80 text-sm transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Info size={14} />
                          <span>{showTechnicalDetails ? "Hide technical details" : "Show technical details"}</span>
                        </div>
                        {showTechnicalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {showTechnicalDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-4 text-center"
                        >
                          <div>
                            <div className="text-[10px] text-white/50 mb-1">DATA POINTS</div>
                            <div className="text-sm font-mono">
                              {Math.floor(Math.random() * 5000 + 3000).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-white/50 mb-1">MODEL CONFIDENCE</div>
                            <div className="text-sm font-mono">
                              {(Math.random() * 0.1 + 0.88).toFixed(4)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-white/50 mb-1">SUCCESS RATE</div>
                            <div className="text-sm font-mono">98.7%</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Simple pagination indicator */}
        <div className="flex justify-center mt-4">
          {insights.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                index === activeInsight
                  ? 'bg-nova w-6'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              onClick={() => {
                setAutoplay(false);
                setActiveInsight(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
