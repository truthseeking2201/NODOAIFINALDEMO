import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Brain,
  Lock,
  Clock,
  ChevronRight,
  Users,
  Timer,
  AlarmClock
} from "lucide-react";

export function NODOAIxPromoBanner() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [activePoint, setActivePoint] = useState(0);
  const [countdown, setCountdown] = useState({ days: 3, hours: 14, minutes: 27 });
  const [secondsCounter, setSecondsCounter] = useState(59);

  const keyPoints = [
    {
      title: "Auto-Compounding Returns",
      icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
      description: "Your tokens grow in value without any manual action"
    },
    {
      title: "Exclusive AI Benefits",
      icon: <Brain className="w-4 h-4 text-amber-500" />,
      description: "Priority access to advanced neural optimization"
    },
    {
      title: "Limited Initial Supply",
      icon: <Lock className="w-4 h-4 text-amber-500" />,
      description: "Early adopters gain maximum token growth potential"
    }
  ];

  // Auto-rotate through key points
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % keyPoints.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [keyPoints.length]);

  // Seconds counter for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsCounter((prev) => prev > 0 ? prev - 1 : 59);

      if (secondsCounter === 0) {
        setCountdown(prev => {
          if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59 };
          } else if (prev.days > 0) {
            return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
          }
          return prev;
        });
      }
    }, 1000); // Update every second
    return () => clearInterval(timer);
  }, [secondsCounter]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDepositNow = () => {
    navigate("/vaults/deep-sui");
  };

  if (!isVisible) return null;

  // Calculate the number of new users in the last hour (random number between 12-24)
  const newUsersLastHour = Math.floor(Math.random() * 13) + 12;

  return (
    <div className="w-full mx-auto">
      <motion.div
        className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Simple background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-7">
          {/* Limited offer banner */}
          <div className="absolute -top-0 left-0 right-0">
            <div className="bg-amber-500 text-black text-xs font-semibold text-center py-1.5 px-4 uppercase tracking-wider">
              Limited Launch Offer — Ends Soon
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8 pt-6">
            {/* Left content - token info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-500">
                    NODOAIx Tokens
                  </h3>
                  <p className="text-white/70 text-sm">
                    Intelligent yield optimization receipts
                  </p>
                </div>
              </div>

              <p className="text-white/90 mb-5">
                When you deposit into any NODO vault, you receive <span className="text-amber-400 font-medium">NODOAIx Tokens</span> that automatically grow in value through our neural network optimizations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 transition-all duration-200 ${
                      activePoint === index
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {point.icon}
                      <h4 className="text-sm font-medium text-white">{point.title}</h4>
                    </div>
                    <p className="text-xs text-white/70">{point.description}</p>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center mt-5 p-3 bg-white/5 rounded-lg border border-white/10">
                <Users className="w-4 h-4 text-amber-500 mr-2" />
                <span className="text-sm text-white/80">
                  <span className="text-amber-400 font-medium">{newUsersLastHour} new users</span> joined in the last hour • <span className="text-amber-400 font-medium">4,328 total</span> early adopters
                </span>
              </div>
            </div>

            {/* Right content - call to action */}
            <div className="w-full md:w-auto">
              <div className="bg-gradient-to-b from-black/60 to-amber-900/10 border border-amber-500/30 rounded-lg p-5 w-full md:w-72">
                <div className="text-center mb-1">
                  <span className="text-amber-400 text-sm font-medium">Initial Launch Bonus</span>
                </div>

                <div className="text-center mb-2">
                  <div className="text-3xl font-bold text-amber-500">
                    +12% APR
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Will decrease to +8% after bonus period
                  </p>
                </div>

                {/* Countdown timer */}
                <div className="bg-black/40 rounded-lg p-3 mb-4 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70">Bonus Ends In:</span>
                    <AlarmClock className="h-3 w-3 text-amber-500" />
                  </div>

                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="bg-black/60 rounded px-2 py-1 min-w-[40px]">
                        <span className="text-xl font-bold font-mono text-white">{countdown.days}</span>
                      </div>
                      <span className="text-[10px] text-white/60">DAYS</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-black/60 rounded px-2 py-1 min-w-[40px]">
                        <span className="text-xl font-bold font-mono text-white">{countdown.hours}</span>
                      </div>
                      <span className="text-[10px] text-white/60">HOURS</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-black/60 rounded px-2 py-1 min-w-[40px]">
                        <span className="text-xl font-bold font-mono text-white">{countdown.minutes}</span>
                      </div>
                      <span className="text-[10px] text-white/60">MINS</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-black/60 rounded px-2 py-1 min-w-[40px]">
                        <span className="text-xl font-bold font-mono text-white">{secondsCounter}</span>
                      </div>
                      <span className="text-[10px] text-white/60">SECS</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDepositNow}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-6 h-12 text-base group"
                >
                  Deposit Now
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="mt-3 text-center">
                  <span className="text-xs text-white/60">Don't miss out on maximum earnings potential</span>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
