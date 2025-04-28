import React, { useEffect, useState, useRef } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, Play, LineChart, GitBranch, ThumbsUp, ThumbsDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface AIAction {
  id: string;
  type: 'add_liquidity' | 'remove_liquidity' | 'rebalance' | 'adjust_range';
  pool: string;
  timestamp: string;
  amount?: number;
  range?: [number, number];
  expectedAprChange: number;
}

interface NovaAIReasoningDrawerProps {
  open: boolean;
  onClose: () => void;
  action: AIAction | null;
}

// Array of friendly sign-off messages
const signOffMessages = [
  "📈 Let's keep your yield climbing!",
  "🔍 Always watching for the best opportunities.",
  "⚡ Optimizing your returns around the clock.",
  "🚀 Your yield journey continues!",
  "💪 Working hard for your crypto.",
  "🎯 Precision is my priority.",
  "🧠 Learning and improving with every action.",
  "🌟 Excellence in yield optimization.",
  "💼 Your portfolio deserves the best care."
];

export function NovaAIReasoningDrawer({ open, onClose, action }: NovaAIReasoningDrawerProps) {
  const [step, setStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [showDecisionTree, setShowDecisionTree] = useState<boolean>(false);
  const [randomSignOff, setRandomSignOff] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset the state when a new action is presented
  useEffect(() => {
    if (open && action) {
      setStep(0);
      setIsTyping(true);
      setShowDecisionTree(false);
      setConfidence(0);

      // Choose a random sign-off message
      const randomIndex = Math.floor(Math.random() * signOffMessages.length);
      setRandomSignOff(signOffMessages[randomIndex]);

      // Scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }

      // Animate typing for first step
      setTimeout(() => {
        setIsTyping(false);
        animateConfidence();
      }, 1500);
    }
  }, [open, action]);

  // Animate confidence meter
  const animateConfidence = () => {
    let currentValue = 0;
    const targetValue = 100;
    const duration = 2000; // ms
    const interval = 50; // ms
    const step = (targetValue / (duration / interval));

    const timer = setInterval(() => {
      currentValue += step;
      setConfidence(Math.min(currentValue, targetValue));

      if (currentValue >= targetValue) {
        clearInterval(timer);
      }
    }, interval);
  };

  // Go to next step
  const goToNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  // Run simulation (replay all steps quickly)
  const runSimulation = () => {
    setIsSimulating(true);
    setStep(0);

    setTimeout(() => {
      setStep(1);
      setTimeout(() => {
        setStep(2);
        setTimeout(() => {
          setStep(3);
          setIsSimulating(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Format the pool name for display (internal name stays as is)
  const formatPoolName = (pool: string) => {
    if (!pool) return '';
    return pool.replace('-', '–').toUpperCase();
  };

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, onClose]);

  if (!action) return null;

  const getActionTitle = () => {
    switch (action.type) {
      case 'add_liquidity':
        return 'Added Liquidity';
      case 'remove_liquidity':
        return 'Removed Liquidity';
      case 'rebalance':
        return 'Rebalanced Position';
      case 'adjust_range':
        return 'Adjusted Position Range';
      default:
        return 'AI Action';
    }
  };

  const getTriggerExplanation = () => {
    switch (action.type) {
      case 'add_liquidity':
        return `I detected a temporary imbalance in the ${formatPoolName(action.pool)} trading pool with increased trading volume. This creates an opportunity to capture more fees.`;
      case 'remove_liquidity':
        return `I noticed increased price volatility in the ${formatPoolName(action.pool)} pool moving outside our optimal range, creating a risk of impermanent loss.`;
      case 'rebalance':
        return `I observed that our current position in the ${formatPoolName(action.pool)} pool has become sub-optimal due to recent market movements.`;
      case 'adjust_range':
        return `I detected a shift in trading patterns for ${formatPoolName(action.pool)}, indicating we should adjust our concentration range.`;
      default:
        return `I detected a change in market conditions for the ${formatPoolName(action.pool)} pool.`;
    }
  };

  const getHypothesis = () => {
    const aprChangeText = action.expectedAprChange > 0
      ? `increase APR by approximately ${action.expectedAprChange.toFixed(2)}%`
      : `prevent an APR reduction of approximately ${Math.abs(action.expectedAprChange).toFixed(2)}%`;

    switch (action.type) {
      case 'add_liquidity':
        return `If we add more liquidity to the ${formatPoolName(action.pool)} pool, we can capture additional trading fees and ${aprChangeText}.`;
      case 'remove_liquidity':
        return `If we reduce our exposure in the ${formatPoolName(action.pool)} pool during this volatility period, we can ${aprChangeText} by avoiding impermanent loss.`;
      case 'rebalance':
        return `If we reposition our liquidity in the ${formatPoolName(action.pool)} pool to align with current price trends, we can ${aprChangeText}.`;
      case 'adjust_range':
        return `If we narrow our liquidity range in the ${formatPoolName(action.pool)} pool to focus on the most active price zone, we can ${aprChangeText}.`;
      default:
        return `If we take action based on these market conditions, we can potentially ${aprChangeText}.`;
    }
  };

  const getEvaluation = () => {
    const pros = [];
    const cons = [];

    // Common pros and cons
    if (action.expectedAprChange > 0) {
      pros.push('Increased yield generation potential');
      pros.push(`Estimated APR improvement of ${action.expectedAprChange.toFixed(2)}%`);
    }

    // Action-specific pros and cons
    switch (action.type) {
      case 'add_liquidity':
        pros.push('Capture increased trading fees during high volume');
        pros.push('Improved capital utilization');
        cons.push('Temporarily increased capital exposure');
        break;
      case 'remove_liquidity':
        pros.push('Reduced risk during volatile periods');
        pros.push('Capital preserved for better opportunities');
        cons.push('Temporarily reduced fee generation');
        break;
      case 'rebalance':
        pros.push('Optimized position for current market conditions');
        pros.push('Better fee capture with reduced impermanent loss risk');
        cons.push('Minor transaction costs for repositioning');
        break;
      case 'adjust_range':
        pros.push('More concentrated liquidity for efficient capital use');
        pros.push('Higher fee capture within specific price range');
        cons.push('Potentially miss fees if price moves outside new range');
        break;
    }

    // Common cons
    cons.push('Market conditions may change rapidly');

    return { pros, cons };
  };

  const getDecision = () => {
    switch (action.type) {
      case 'add_liquidity':
        return `Added ${action.amount?.toLocaleString()} USDC to ${formatPoolName(action.pool)} ${action.range ? `at range ${action.range[0]}–${action.range[1]}` : ''}`;
      case 'remove_liquidity':
        return `Removed ${action.amount?.toLocaleString()} USDC from ${formatPoolName(action.pool)} ${action.range ? `at range ${action.range[0]}–${action.range[1]}` : ''}`;
      case 'rebalance':
        return `Rebalanced ${formatPoolName(action.pool)} position ${action.range ? `to new range ${action.range[0]}–${action.range[1]}` : ''}`;
      case 'adjust_range':
        return `Adjusted ${formatPoolName(action.pool)} position range from to ${action.range ? `${action.range[0]}–${action.range[1]}` : 'optimal zone'}`;
      default:
        return `Executed optimization action for ${formatPoolName(action.pool)}`;
    }
  };

  const evaluation = getEvaluation();

  return (
    <Drawer
      open={open}
      onOpenChange={(newOpen) => !newOpen && onClose()}
      modal={true}
    >
      <DrawerContent className="max-w-[450px] sm:max-w-[550px] h-[90vh] rounded-t-xl bg-card border-t border-white/10">
        <div className="h-full rounded-t-xl overflow-hidden">
          <DrawerHeader className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </DrawerClose>
              <DrawerTitle className="text-lg font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-nova to-nova-dark flex items-center justify-center animate-pulse">
                </div>
                Nova AI Reasoning
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div ref={contentRef} className="card-padding overflow-y-auto h-[calc(90vh-64px)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nova to-nova-dark flex items-center justify-center">
                  <span className="text-xs font-bold">N</span>
                </div>
                <div>
                  <h3 className="font-medium">Nova</h3>
                  <p className="text-xs text-white/60">AI Yield Optimizer</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                <div className={`w-2 h-2 rounded-full ${confidence === 100 ? 'bg-emerald' : 'bg-nova'} animate-pulse`}></div>
                <span className="text-xs font-medium">
                  {confidence === 100 ? "Action Complete" : "Processing..."}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-white/80">{getActionTitle()}</h4>
                <span className="text-xs text-white/60">
                  {new Date(action.timestamp).toLocaleTimeString()} | Confidence: {confidence.toFixed(0)}%
                </span>
              </div>
              <Progress value={confidence} className="h-1 bg-white/5" indicatorClassName="bg-gradient-to-r from-nova to-nova-dark" />
            </div>

            <div className="component-spacing">
              {/* Step 1: Trigger */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h4 className="font-medium">Trigger Detected</h4>
                </div>
                <AnimatePresence mode="wait">
                  {(step >= 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-8"
                    >
                      {isTyping && step === 0 ? (
                        <div className="flex items-center gap-1 h-6">
                          <span>Analyzing</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-white/80">{getTriggerExplanation()}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Hypothesis */}
              <div className={`bg-white/5 rounded-lg p-4 ${step < 1 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h4 className="font-medium">Hypothesis</h4>
                </div>
                <AnimatePresence mode="wait">
                  {(step >= 1) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-8"
                    >
                      {isTyping && step === 1 ? (
                        <div className="flex items-center gap-1 h-6">
                          <span>Formulating</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-white/80">{getHypothesis()}</p>
                          <div className="mt-3 bg-white/5 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <LineChart size={16} className="text-nova" />
                              <span className="text-xs font-medium">Projected APR Impact</span>
                            </div>
                            <div className="h-20 bg-card rounded relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-lg font-mono font-semibold ${action.expectedAprChange > 0 ? 'text-emerald' : 'text-red-500'}`}>
                                  {action.expectedAprChange > 0 ? '+' : ''}{action.expectedAprChange.toFixed(2)}%
                                </span>
                              </div>
                              {/* This would be a real chart in the actual implementation */}
                              <div className="absolute inset-0 opacity-30">
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                                  <path
                                    d="M0,20 Q25,5 50,20 T100,20"
                                    fill="none"
                                    stroke={action.expectedAprChange > 0 ? '#10b981' : '#ef4444'}
                                    strokeWidth="2"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 3: Evaluation */}
              <div className={`bg-white/5 rounded-lg p-4 ${step < 2 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h4 className="font-medium">Evaluation</h4>
                </div>
                <AnimatePresence mode="wait">
                  {(step >= 2) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-8"
                    >
                      {isTyping && step === 2 ? (
                        <div className="flex items-center gap-1 h-6">
                          <span>Evaluating</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        <div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <ThumbsUp size={14} className="text-emerald" />
                                <span className="text-sm font-medium text-emerald">Pros</span>
                              </div>
                              <ul className="space-y-1 pl-6 text-sm text-white/80">
                                {evaluation.pros.map((pro, index) => (
                                  <li key={`pro-${index}`} className="list-disc text-emerald">
                                    <span className="text-white/80">{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <ThumbsDown size={14} className="text-red-500" />
                                <span className="text-sm font-medium text-red-500">Cons</span>
                              </div>
                              <ul className="space-y-1 pl-6 text-sm text-white/80">
                                {evaluation.cons.map((con, index) => (
                                  <li key={`con-${index}`} className="list-disc text-red-500">
                                    <span className="text-white/80">{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              onClick={() => setShowDecisionTree(!showDecisionTree)}
                              className="flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white/80 transition-all duration-300 focus-ring p-2 -m-2 rounded"
                            >
                              <GitBranch size={14} />
                              {showDecisionTree ? 'Hide decision tree' : 'Show decision tree'}
                            </button>

                            {showDecisionTree && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 p-3 bg-card rounded text-xs"
                              >
                                <div className="text-center text-white/60">Decision Tree Visualization</div>
                                {/* Placeholder for actual decision tree visualization */}
                                <div className="h-40 flex items-center justify-center text-white/40">
                                  Decision tree visualization would be displayed here
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 4: Decision */}
              <div className={`bg-white/5 rounded-lg p-4 ${step < 3 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <h4 className="font-medium">Decision</h4>
                </div>
                <AnimatePresence mode="wait">
                  {(step >= 3) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-8"
                    >
                      {isTyping && step === 3 ? (
                        <div className="flex items-center gap-1 h-6">
                          <span>Finalizing</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-white">{getDecision()}</p>
                          <p className="mt-4 text-sm text-white/70 italic">{randomSignOff}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              {step < 3 ? (
                <Button
                  variant="nova"
                  onClick={goToNextStep}
                  className="focus-ring"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 focus-ring"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  <Play size={14} />
                  {isSimulating ? 'Replaying...' : 'Run Simulation'}
                </Button>
              )}

              <Button variant="outline" className="focus-ring" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
