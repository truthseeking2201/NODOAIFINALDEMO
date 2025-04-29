import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Brain,
  ShieldCheck,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  BarChart4,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { AIConfidenceScore } from "./AIConfidenceScore";
import { NeuroProcessingVisualizer } from "./NeuroProcessingVisualizer";
import { TranslatedSection } from "@/components/shared/TranslatedSection";
import { TranslatedText } from "@/components/shared/TranslatedText";

interface AIControlPanelProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  vaultName: string;
}

type AIAction = {
  id: string;
  type: 'optimize' | 'rebalance' | 'secure' | 'analyze';
  timestamp: Date;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
};

export function AIControlPanel({ vaultType, vaultName }: AIControlPanelProps) {
  const [aiConfidenceScore, setAiConfidenceScore] = useState<number>(92);
  const [neuroProcessingScore, setNeuroProcessingScore] = useState<number>(87);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [recentAIActions, setRecentAIActions] = useState<AIAction[]>([]);
  const [activePanel, setActivePanel] = useState<'performance' | 'security' | 'actions'>('performance');

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        border: 'border-nova/20',
        gradient: 'from-nova to-amber-500',
        buttonGradient: 'from-orange-600 to-amber-500',
        hoverGradient: 'from-orange-500 to-amber-400'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        border: 'border-orion/20',
        gradient: 'from-orion to-yellow-500',
        buttonGradient: 'from-amber-600 to-yellow-500',
        hoverGradient: 'from-amber-500 to-yellow-400'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        border: 'border-emerald/20',
        gradient: 'from-emerald to-green-500',
        buttonGradient: 'from-emerald to-green-500',
        hoverGradient: 'from-emerald/90 to-green-400'
      };
    }
  };

  const colors = getTypeColor();

  // Generate random AI actions
  useEffect(() => {
    const generateRandomAction = (): AIAction => {
      const actionTypes: ('optimize' | 'rebalance' | 'secure' | 'analyze')[] = ['optimize', 'rebalance', 'secure', 'analyze'];
      const selectedType = actionTypes[Math.floor(Math.random() * actionTypes.length)];

      let description = '';
      let impact = '';

      switch (selectedType) {
        case 'optimize':
          description = [
            "Optimized liquidity positions for higher returns",
            "Adjusted yield farming strategy based on market conditions",
            "Refined interest rate model parameters"
          ][Math.floor(Math.random() * 3)];
          impact = [
            "+0.32% APR improvement",
            "Reduced gas costs by 15%",
            "+0.18% efficiency gain"
          ][Math.floor(Math.random() * 3)];
          break;
        case 'rebalance':
          description = [
            "Rebalanced asset allocation to optimize risk/reward",
            "Adjusted position sizing based on volatility analysis",
            "Redistributed capital across liquidity pools"
          ][Math.floor(Math.random() * 3)];
          impact = [
            "Risk exposure reduced by 8%",
            "Improved capital efficiency by 11%",
            "Reduced impermanent loss potential"
          ][Math.floor(Math.random() * 3)];
          break;
        case 'secure':
          description = [
            "Enhanced security protocols for DeFi interactions",
            "Implemented additional oracle verification",
            "Updated risk mitigation parameters"
          ][Math.floor(Math.random() * 3)];
          impact = [
            "Vulnerability risk reduced by 25%",
            "Improved data reliability by 18%",
            "Enhanced slippage protection"
          ][Math.floor(Math.random() * 3)];
          break;
        case 'analyze':
          description = [
            "Analyzed market conditions and competition",
            "Deep learning pattern recognition completed",
            "Performed predictive analysis on token performance"
          ][Math.floor(Math.random() * 3)];
          impact = [
            "12 new opportunities identified",
            "Prediction accuracy improved to 91%",
            "Market insight confidence +14%"
          ][Math.floor(Math.random() * 3)];
          break;
      }

      const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        type: selectedType,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
        description,
        impact,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
    };

    // Generate initial actions
    const initialActions = Array(5).fill(null).map(() => generateRandomAction());
    setRecentAIActions(initialActions);

    // Add new actions periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newAction = generateRandomAction();
        setRecentAIActions(prev => [newAction, ...prev].slice(0, 10));

        // Occasionally update AI confidence and Neuro Processing scores
        if (Math.random() > 0.7) {
          const confidenceChange = (Math.random() * 4 - 2);
          setAiConfidenceScore(prev => Math.min(Math.max(prev + confidenceChange, 75), 99));

          const neuroChange = (Math.random() * 3 - 1);
          setNeuroProcessingScore(prev => Math.min(Math.max(prev + neuroChange, 70), 98));
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Get icon for action type
  const getActionIcon = (type: AIAction['type']) => {
    switch (type) {
      case 'optimize': return <Brain className={colors.primary} size={16} />;
      case 'rebalance': return <RefreshCw className={colors.primary} size={16} />;
      case 'secure': return <ShieldCheck className={colors.primary} size={16} />;
      case 'analyze': return <BarChart4 className={colors.primary} size={16} />;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg relative bg-[#060708]">
      {/* Header */}
      <div className="p-6 pb-4">
        <TranslatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              vaultType === 'nova' ? 'bg-gradient-to-br from-nova/30 to-nova/10' :
              vaultType === 'orion' ? 'bg-gradient-to-br from-orion/30 to-orion/10' :
              'bg-gradient-to-br from-emerald/30 to-emerald/10'
            }`}>
              <Brain size={20} className={
                vaultType === 'nova' ? 'text-nova' :
                vaultType === 'orion' ? 'text-orion' :
                'text-emerald'
              } />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                <TranslatedText id="theoDoi">Theo dõi sức khỏe AI</TranslatedText>
              </h3>
              <p className="text-sm text-white/60">
                <TranslatedText id="aIDangHoatDong">AI đang hoạt động chế độ trên tối</TranslatedText>
              </p>
            </div>
          </div>
        </TranslatedSection>

        {/* Tab Navigation */}
        <TranslatedSection>
          <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
            <button
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activePanel === 'performance'
                  ? `bg-gradient-to-r ${colors.buttonGradient} text-white`
                  : 'text-white/60 hover:text-white/80 hover:bg-white/10'
              }`}
              onClick={() => setActivePanel('performance')}
            >
              <TranslatedText id="doTinCayAI">Độ tin cậy AI</TranslatedText>
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activePanel === 'security'
                  ? `bg-gradient-to-r ${colors.buttonGradient} text-white`
                  : 'text-white/60 hover:text-white/80 hover:bg-white/10'
              }`}
              onClick={() => setActivePanel('security')}
            >
              <TranslatedText id="saoNangAI">Sao nâng AI</TranslatedText>
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activePanel === 'actions'
                  ? `bg-gradient-to-r ${colors.buttonGradient} text-white`
                  : 'text-white/60 hover:text-white/80 hover:bg-white/10'
              }`}
              onClick={() => setActivePanel('actions')}
            >
              <TranslatedText id="hoatDongAiGanDay">Hoạt động AI gần đây</TranslatedText>
            </button>
          </div>
        </TranslatedSection>
      </div>

      {/* Panel Content */}
      <div className="p-6 pt-2 space-y-4">
        <AnimatePresence mode="wait">
          {activePanel === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <AIConfidenceScore
                vaultType={vaultType}
                score={aiConfidenceScore}
                onChange={setAiConfidenceScore}
              />

              <NeuroProcessingVisualizer
                vaultType={vaultType}
                score={neuroProcessingScore}
                onChange={setNeuroProcessingScore}
              />

              <div className="bg-black/30 rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className={colors.primary} />
                    <h3 className="text-sm font-medium text-white">Performance Summary</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-1">APR Optimization</div>
                    <div className="text-lg font-mono font-medium text-white flex items-center">
                      +{(Math.random() * 2 + 1.5).toFixed(2)}%
                      <span className="text-xs text-white/60 ml-1.5">vs. market</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Gas Efficiency</div>
                    <div className="text-lg font-mono font-medium text-white flex items-center">
                      -{(Math.random() * 25 + 10).toFixed(0)}%
                      <span className="text-xs text-white/60 ml-1.5">costs saved</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Success Rate</div>
                    <div className="text-lg font-mono font-medium text-white flex items-center">
                      {(Math.random() * 5 + 94).toFixed(1)}%
                      <span className="text-xs text-white/60 ml-1.5">transactions</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Position Growth</div>
                    <div className="text-lg font-mono font-medium text-white flex items-center">
                      +{(Math.random() * 12 + 8).toFixed(1)}%
                      <span className="text-xs text-white/60 ml-1.5">last 30d</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-black/30 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                {/* Security pulse effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className={`w-4 h-4 rounded-full ${colors.bg}`}
                      animate={{
                        scale: [1, 3, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <ShieldCheck size={16} className={colors.primary} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Security Status</h3>
                    <div className="text-xs text-white/60">AI-powered protection active</div>
                  </div>

                  <div className="ml-auto px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Active & Secure
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="text-xs text-white/60 mb-1">Risk Score</div>
                      <div className="flex items-center">
                        <div className="text-lg font-mono font-medium text-green-500">Low</div>
                        <div className="ml-2 w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="text-xs text-white/60 mb-1">Security Checks</div>
                      <div className="text-lg font-mono font-medium text-white">
                        {Math.floor(Math.random() * 200 + 800)}/hr
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-2">Active Protections</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        <span className="text-white/80">Multi-oracle verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        <span className="text-white/80">Real-time transaction monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        <span className="text-white/80">Anomaly detection algorithms</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        <span className="text-white/80">Emergency circuit breakers</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-white/60">Last Security Report</div>
                      <div className="text-xs text-white/60">{formatTimestamp(new Date(Date.now() - 1000 * 60 * 15))}</div>
                    </div>
                    <div className="p-2 bg-black/30 rounded-lg text-xs text-white/80">
                      All systems operating within normal parameters. No suspicious activities detected in the last 24 hours. Slippage protection engaged for all transactions.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-black/30 rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className={colors.primary} />
                    <h3 className="text-sm font-medium text-white">Recent AI Actions</h3>
                  </div>

                  <button
                    className="text-xs text-white/60 hover:text-white flex items-center transition-colors"
                    onClick={() => setShowRecentActivity(!showRecentActivity)}
                  >
                    {showRecentActivity ? "Show less" : "Show all"}
                    <ChevronDown
                      size={14}
                      className="ml-1 transition-transform"
                      style={{ transform: showRecentActivity ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                </div>

                <div className={`space-y-2 ${showRecentActivity ? '' : 'max-h-64 overflow-y-auto custom-scrollbar'}`}>
                  {recentAIActions
                    .slice(0, showRecentActivity ? undefined : 5)
                    .map((action) => (
                    <div key={action.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-lg ${colors.bg}`}>
                            {getActionIcon(action.type)}
                          </div>
                          <div className="text-sm font-medium text-white capitalize">
                            {action.type} Action
                          </div>
                        </div>

                        <div className={`
                          px-2 py-0.5 rounded-full text-[10px] font-medium
                          ${action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            action.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'}
                        `}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)} Priority
                        </div>
                      </div>

                      <div className="text-xs text-white/80 mb-1">{action.description}</div>

                      <div className="flex justify-between items-center text-[10px]">
                        <div className="text-white/60">
                          {formatTimestamp(action.timestamp)}
                        </div>

                        <div className={`font-medium ${
                          action.impact.includes('+') ? 'text-green-400' :
                          action.impact.includes('-') ? 'text-red-400' :
                          colors.primary
                        }`}>
                          {action.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={`
                  w-full mt-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r
                  ${colors.buttonGradient} hover:${colors.hoverGradient}
                  text-white transition-all hover:scale-[0.99]
                `}>
                  View AI Analytics Dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4 inline" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper to format timestamp
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
