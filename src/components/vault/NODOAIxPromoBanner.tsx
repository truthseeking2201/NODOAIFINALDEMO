import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  Brain,
  Lock,
  Clock,
  ChevronRight,
  Users,
  Timer,
  AlarmClock,
  CheckCircle
} from "lucide-react";

export function NODOAIxPromoBanner() {
  const navigate = useNavigate();
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

  const handleDepositNow = () => {
    navigate("/vaults/deep-sui");
  };

  // Calculate the number of new users in the last hour (random number between 12-24)
  const newUsersLastHour = Math.floor(Math.random() * 13) + 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left content - token info */}
      <Card className="col-span-1 lg:col-span-8 bg-black/30 backdrop-blur-sm border-amber-500/20 overflow-hidden">
        <div className="p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: activePoint === index ? 1.05 : 1,
                  borderColor: activePoint === index ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border p-3 transition-all duration-200 ${
                  activePoint === index
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {point.icon}
                  <h4 className="text-sm font-medium text-white">{point.title}</h4>
                </div>
                <p className="text-xs text-white/70">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Social proof */}
            <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <Users className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-sm text-white/80">
                <span className="text-amber-400 font-medium">{newUsersLastHour} new users</span> joined in the last hour
              </span>
            </div>

            <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald mr-2" />
              <span className="text-sm text-white/80">
                <span className="text-emerald font-medium">4,328 users</span> earning returns
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right content - call to action */}
      <Card className="col-span-1 lg:col-span-4 bg-gradient-to-b from-black/60 to-amber-900/10 border-amber-500/30 overflow-hidden">
        <div className="p-6">
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
      </Card>
    </div>
  );
}
