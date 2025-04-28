import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Brain,
  Sparkles,
  AlertCircle,
  RefreshCw,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIQueryAssistantProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  vaultName: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Predefined suggestions for users to click on
const SUGGESTIONS = [
  "How is AI optimizing this vault?",
  "What's the risk level?",
  "How often does the AI rebalance?",
  "What happens if market crashes?"
];

// Predefined answers to common questions
const AI_RESPONSES: Record<string, (vaultType: string, vaultName: string) => string> = {
  "how is ai optimizing this vault": (vaultType, vaultName) => {
    switch (vaultType) {
      case 'nova':
        return `For the high-yield ${vaultName} vault, our neural network employs aggressive optimization strategies, constantly analyzing market liquidity and price action to execute precisely-timed trades. The AI monitors over 28 different market indicators in real-time, rebalancing positions approximately every 3-4 hours to capture maximum yield while implementing protective measures when volatility exceeds predefined thresholds.`;
      case 'orion':
        return `The ${vaultName} vault utilizes a balanced AI approach, where our neural networks optimize for both yield and stability. The AI analyzes 22 market indicators to identify optimal trading opportunities while maintaining moderate risk levels. Position rebalancing occurs approximately every 6 hours, with a stronger emphasis on minimizing impermanent loss compared to higher-risk vaults.`;
      case 'emerald':
        return `For the conservative ${vaultName} vault, our AI prioritizes capital preservation while still generating competitive yields. The neural network employs sophisticated risk management algorithms that analyze 18 key market indicators, maintaining strict volatility thresholds. The AI rebalances positions approximately every 12 hours and implements automatic defensive positioning during market turbulence.`;
    }
  },
  "what's the risk level": (vaultType, vaultName) => {
    switch (vaultType) {
      case 'nova':
        return `The ${vaultName} vault has a high risk profile, designed for users seeking maximum yields who can tolerate higher volatility. While our AI implements protective measures, this vault experiences larger price swings and has higher exposure to impermanent loss. The neural risk management system maintains a 24/7 monitoring system with automated circuit breakers to limit downside during extreme market events.`;
      case 'orion':
        return `The ${vaultName} vault has a medium risk profile, balancing yield generation with reasonable stability. Our AI optimizers target moderate exposure to market movements while implementing more conservative position sizing. This balanced approach makes it suitable for users who want attractive yields without the volatility of high-risk options.`;
      case 'emerald':
        return `The ${vaultName} vault employs a low risk strategy, prioritizing capital preservation and stable returns. The AI risk management system maintains strict volatility controls, with position sizes and trading pairs specifically selected to minimize impermanent loss. This vault is ideal for users seeking predictable returns with minimal downside exposure.`;
    }
  },
  "how often does the ai rebalance": (vaultType, vaultName) => {
    switch (vaultType) {
      case 'nova':
        return `The ${vaultName} vault's neural optimizer performs frequent rebalancing approximately every 3-4 hours under normal market conditions. During periods of high volatility, rebalancing frequency can increase to hourly intervals to capture trading opportunities or implement defensive measures. Each rebalance is optimized for gas efficiency to ensure maximum returns.`;
      case 'orion':
        return `For the balanced ${vaultName} vault, AI-driven rebalancing occurs approximately every 6 hours. The neural network continuously monitors market conditions and may adjust this frequency based on volatility and arbitrage opportunities. The AI balances trading frequency against gas costs to optimize overall yield performance.`;
      case 'emerald':
        return `The conservative ${vaultName} vault utilizes a more measured approach, with AI rebalancing occurring approximately every 12 hours under normal conditions. This reduced frequency minimizes gas costs and prioritizes stable, predictable performance over frequent trading. During unusual market conditions, the rebalancing schedule may adjust to provide additional protection.`;
    }
  },
  "what happens if market crashes": (vaultType, vaultName) => {
    switch (vaultType) {
      case 'nova':
        return `The ${vaultName} vault implements AI-powered circuit breakers that activate during extreme market conditions. If a significant crash is detected, the neural network will automatically shift a portion of assets to stablecoins and reduce position sizes to limit downside exposure. However, as this is a high-risk vault, users should expect more significant drawdowns compared to more conservative options.`;
      case 'orion':
        return `For the ${vaultName} vault, our AI implements progressive defensive measures during market downturns. The neural safety system monitors multiple risk indicators and gradually increases stable asset allocation as risk levels rise. This balanced approach aims to provide partial downside protection while maintaining some exposure to recovery opportunities.`;
      case 'emerald':
        return `The ${vaultName} vault's defensive AI system prioritizes capital preservation during market crashes. The neural risk management algorithms will rapidly shift the majority of assets to stablecoin positions when specific market triggers are detected. This conservative approach means the vault may underperform during quick recoveries but provides substantial protection during extended downturns.`;
    }
  }
};

export function AIQueryAssistant({ vaultType, vaultName }: AIQueryAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTypeColor = () => {
    switch (vaultType) {
      case 'nova': return {
        primary: 'text-nova',
        secondary: 'text-amber-500',
        bg: 'bg-nova/10',
        bgDark: 'bg-nova/20',
        border: 'border-nova/20',
        fill: 'bg-nova'
      };
      case 'orion': return {
        primary: 'text-orion',
        secondary: 'text-yellow-500',
        bg: 'bg-orion/10',
        bgDark: 'bg-orion/20',
        border: 'border-orion/20',
        fill: 'bg-orion'
      };
      case 'emerald': return {
        primary: 'text-emerald',
        secondary: 'text-green-500',
        bg: 'bg-emerald/10',
        bgDark: 'bg-emerald/20',
        border: 'border-emerald/20',
        fill: 'bg-emerald'
      };
    }
  };

  const colors = getTypeColor();

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showChat]);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to the ${vaultName} AI assistant. How can I help you understand this vault's strategy?`,
        timestamp: new Date()
      }
    ]);
  }, [vaultName]);

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedSuggestion) return;

    const userMessage = input || selectedSuggestion || '';

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedSuggestion(null);
    setIsTyping(true);

    // Simulate AI thinking and processing
    setTimeout(() => {
      // Generate or find appropriate response
      const normalized = userMessage.toLowerCase().trim();
      let aiResponse = '';

      // Find the closest matching predefined question
      for (const [key, responseFn] of Object.entries(AI_RESPONSES)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          aiResponse = responseFn(vaultType, vaultName);
          break;
        }
      }

      // Fallback response if no match found
      if (!aiResponse) {
        aiResponse = `I understand you're asking about "${userMessage}" for the ${vaultName} vault. While I don't have specific information on that query, I can tell you that this ${
          vaultType === 'nova' ? 'high-yield' :
          vaultType === 'orion' ? 'balanced' :
          'conservative'
        } vault uses advanced neural networks to optimize your yields while managing risk appropriately for its category. Would you like to know more about how the AI optimizes this vault or its risk profile?`;
      }

      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setIsTyping(false);
      setMessages(prev => [...prev, assistantMsg]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setInput(suggestion);

    // Wait a moment for the UI to update, then send
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="relative z-10">
      {/* Floating chat button */}
      <AnimatePresence>
        {!showChat && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 p-0.5 rounded-full ${colors.bg} ${colors.border} border shadow-lg cursor-pointer`}
            onClick={() => setShowChat(true)}
          >
            <div className="bg-black/70 backdrop-blur-md rounded-full p-3 flex items-center justify-center">
              <Brain className={`${colors.primary} animate-pulse`} size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat popup */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-80 sm:w-96 h-96 rounded-2xl bg-black/90 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className={`p-3 ${colors.bgDark} backdrop-blur-md flex items-center justify-between border-b border-white/10`}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Brain size={18} className={colors.primary} />
                  <motion.div
                    className="absolute -inset-1 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ borderWidth: 1, borderColor: colors.primary }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">NODO AI Assistant</h3>
                  <p className="text-[10px] text-white/50">Vault intelligence</p>
                </div>
              </div>
              <button
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setShowChat(false)}
              >
                <X size={14} className="text-white/70" />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.role === 'assistant'
                        ? 'bg-white/10 rounded-tl-sm text-white'
                        : `${colors.bgDark} rounded-tr-sm ${colors.primary}`
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Brain size={12} className={colors.primary} />
                        <span className="text-xs font-medium">Vault AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-right mt-1">
                      <span className="text-[9px] opacity-50">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* AI typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl rounded-tl-sm p-3 bg-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Brain size={12} className={colors.primary} />
                      <span className="text-xs font-medium">Vault AI</span>
                    </div>
                    <motion.div
                      className="flex items-center gap-1.5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <div className="h-2 w-2 rounded-full bg-white/40"></div>
                      <div className="h-2 w-2 rounded-full bg-white/40 animation-delay-200"></div>
                      <div className="h-2 w-2 rounded-full bg-white/40 animation-delay-500"></div>
                    </motion.div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            {messages.length <= 2 && (
              <div className="p-3 pt-0 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    className={`px-2 py-1 rounded-full text-xs ${colors.bg} border ${colors.border} hover:bg-white/10 transition-colors`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this vault..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() && !selectedSuggestion}
                className={`p-2 rounded-full ${
                  input.trim() || selectedSuggestion
                    ? colors.bgDark
                    : 'bg-white/5'
                } transition-colors`}
              >
                <Send size={16} className={input.trim() || selectedSuggestion ? colors.primary : 'text-white/40'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
