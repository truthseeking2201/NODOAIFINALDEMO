import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  Brain,
  Lock,
  ArrowRight,
  Users,
  CheckCircle
} from "lucide-react";

export function NODOAIxPromoBanner() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ days: 3, hours: 14, minutes: 22, seconds: 15 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDepositNow = () => {
    navigate("/vaults/deep-sui");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left content - token info */}
      <Card className="col-span-1 lg:col-span-8 bg-black/20 border border-white/10 overflow-hidden rounded-xl">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">NODOAIx Tokens</h3>
            </div>
          </div>

          <p className="text-white/90 mb-6 text-base">
            Receive tokens that grow in value through our neural network optimizations when you deposit into any NODO vault.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-white/5 bg-black/30 p-4 hover:border-amber-500/20 hover:bg-black/40 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="text-sm font-medium text-white">Auto-Compounding</h4>
              </div>
              <p className="text-xs text-white/70">Value grows without manual action</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-4 hover:border-amber-500/20 hover:bg-black/40 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                  <Brain className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="text-sm font-medium text-white">AI Benefits</h4>
              </div>
              <p className="text-xs text-white/70">Priority access to neural optimization</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-4 hover:border-amber-500/20 hover:bg-black/40 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                  <Lock className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="text-sm font-medium text-white">Limited Supply</h4>
              </div>
              <p className="text-xs text-white/70">Early adopters gain maximum potential</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-black/30 rounded-lg border border-white/5">
              <Users className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-sm text-white/80">
                <span className="text-amber-400 font-medium">14 new users</span> joined in the last hour
              </span>
            </div>

            <div className="flex items-center p-3 bg-black/30 rounded-lg border border-white/5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
              <span className="text-sm text-white/80">
                <span className="text-emerald-500 font-medium">4,328 users</span> earning returns
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right content - call to action */}
      <Card className="col-span-1 lg:col-span-4 bg-black/20 border border-white/10 overflow-hidden rounded-xl">
        <div className="p-8">
          <div className="text-center mb-2">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Initial Launch Bonus</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-amber-500">+12% APR</div>
            <p className="text-xs text-white/60 mt-1">Will decrease to +8% after bonus period</p>
          </div>

          {/* Countdown timer */}
          <div className="mb-6">
            <div className="text-center mb-2">
              <span className="text-sm text-white/80 font-medium">Bonus Ends In:</span>
            </div>

            <div className="flex justify-between gap-3">
              <div className="text-center flex-1">
                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                  <span className="text-2xl font-bold font-mono text-white">{countdown.days}</span>
                </div>
                <span className="text-xs text-white/60 uppercase mt-1 block">Days</span>
              </div>
              <div className="text-center flex-1">
                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                  <span className="text-2xl font-bold font-mono text-white">{countdown.hours}</span>
                </div>
                <span className="text-xs text-white/60 uppercase mt-1 block">Hours</span>
              </div>
              <div className="text-center flex-1">
                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                  <span className="text-2xl font-bold font-mono text-white">{countdown.minutes}</span>
                </div>
                <span className="text-xs text-white/60 uppercase mt-1 block">Mins</span>
              </div>
              <div className="text-center flex-1">
                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                  <span className="text-2xl font-bold font-mono text-white">{countdown.seconds}</span>
                </div>
                <span className="text-xs text-white/60 uppercase mt-1 block">Secs</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDepositNow}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium py-6 h-12 text-base group rounded-lg shadow-lg transition-all duration-200"
          >
            Deposit Now
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="mt-3 text-center">
            <span className="text-xs text-white/60">Don't miss out on maximum earnings potential</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
