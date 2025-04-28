import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, ChevronRight, MessageSquare, Zap, Database, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
  icon: React.ReactNode;
}

export function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Default suggestions
  const suggestions: Suggestion[] = [
    {
      id: "1",
      text: "How do AI-optimized vaults work?",
      icon: <Brain size={14} className="text-nova" />
    },
    {
      id: "2",
      text: "Compare risk levels across vaults",
      icon: <Database size={14} className="text-orion" />
    },
    {
      id: "3",
      text: "Help me optimize my portfolio",
      icon: <Zap size={14} className="text-emerald-500" />
    },
    {
      id: "4",
      text: "Explain NODOAIx tokens",
      icon: <Sparkles size={14} className="text-amber-500" />
    }
  ];

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        text: "Hi there! I'm NODO AI Assistant. I can help you with investment strategies, explain our vaults, or provide market insights. How can I assist you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animate the assistant button periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 2000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Focus on input when sheet opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate assistant response after a delay
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputValue(suggestionText);
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple response generation (this would be replaced by actual API call)
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("risk") && input.includes("level")) {
      return "I can explain our risk levels! We categorize vaults as Low (Emerald), Medium (Orion), and High (Nova) risk. Low risk vaults have stable assets with minimal volatility, while High risk vaults may offer higher potential returns but with increased volatility. Our AI continuously monitors all risk factors and can adjust positions to maximize protection.";
    }

    if (input.includes("ai") && (input.includes("vault") || input.includes("optimize"))) {
      return "NODO AI-optimized vaults use advanced neural networks to analyze market conditions and optimize asset allocation in real-time. Our AI examines thousands of data points to identify the best yield opportunities while managing risk according to your preferences. This allows us to achieve higher returns than traditional yield aggregators.";
    }

    if (input.includes("token") || input.includes("nodoaix")) {
      return "NODOAIx tokens represent your share in our vaults. When you deposit assets, you receive these tokens which appreciate in value as the vault generates returns. These tokens are non-transferable and automatically burn when you withdraw, converting back to your original asset plus any earned yield. They serve as your receipt of deposit and proof of ownership.";
    }

    if (input.includes("portfolio") && input.includes("optimi")) {
      return "I'd be happy to help optimize your portfolio! Based on your risk preference and investment goals, I can recommend a balanced allocation across our vaults. For most users, a mix of 60% in medium-risk Orion vaults, 20% in low-risk Emerald vaults, and 20% in high-risk Nova vaults provides a good balance of stability and growth potential. Would you like me to create a specific recommendation?";
    }

    return "Thanks for your question! I've made a note of that and will provide a detailed response shortly. Is there anything specific about this topic you'd like me to focus on?";
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Assistant Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: pulseAnimation ? [0, -10, 0] : 0
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="w-12 h-12 rounded-full bg-gradient-to-r from-nova-600 to-nova-500 hover:shadow-lg hover:shadow-nova/20 p-0 relative">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: pulseAnimation ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: pulseAnimation ? 0.5 : 0,
                  repeat: pulseAnimation ? 1 : 0,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>

              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: pulseAnimation
                    ? ["0 0 0 0 rgba(249, 115, 22, 0)", "0 0 0 8px rgba(249, 115, 22, 0.3)", "0 0 0 15px rgba(249, 115, 22, 0)"]
                    : "0 0 0 0 rgba(249, 115, 22, 0)"
                }}
                transition={{ duration: 1.5 }}
              />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-md bg-[#121620]/95 border-l border-white/10 backdrop-blur-xl p-0 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-nova/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-nova" />
                </div>
                <div>
                  <h3 className="font-medium text-white">NODO AI Assistant</h3>
                  <p className="text-xs text-white/60">Powered by NodaLLM v4.2</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        message.type === "user"
                          ? "bg-nova/20 text-white ml-4"
                          : "bg-white/10 text-white mr-4"
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div className="text-[10px] mt-1 text-white/40 text-right">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white/10 text-white rounded-2xl px-4 py-2 mr-4">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-nova"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 0.1
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-nova"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 0.2,
                          delay: 0.15
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-nova"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 0.3,
                          delay: 0.3
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Dummy div for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="p-3 border-t border-white/10">
                <div className="text-xs text-white/50 mb-2">Suggested questions:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="outline"
                      size="sm"
                      className="h-auto py-1.5 text-xs bg-white/5 border-white/10 hover:bg-white/10"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      <div className="flex items-center gap-1.5">
                        {suggestion.icon}
                        <span>{suggestion.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Container */}
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask NODO AI Assistant..."
                  className="w-full bg-white/5 text-white border border-white/10 rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-nova/50 placeholder:text-white/40"
                />
                <Button
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-nova rounded-full hover:bg-nova-500"
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === "" || isTyping}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center mt-2 justify-between">
                <div className="text-[10px] text-white/40 flex items-center gap-1">
                  <Brain size={8} />
                  <span>AI-powered responses</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-white/40 hover:text-white/60">
                  <Search size={8} className="mr-1" /> Search Knowledge Base
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
}
