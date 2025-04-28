import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  DollarSign,
  Percent
} from "lucide-react";

export function OptimizationEngineCard() {
  return (
    <div className="bg-gradient-to-b from-black/40 via-black/50 to-black/60 rounded-xl border border-white/10 shadow-md overflow-hidden">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-br from-nova/20 to-nova/5">
              <TrendingUp size={20} className="text-nova" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Smart Investment Engine</h3>
            <p className="text-sm text-white/70">Automatically optimizing your returns</p>
          </div>
        </div>

        {/* Main Content - Split into two columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left side - What's happening */}
          <div className="space-y-3">
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <h4 className="text-white/90 font-medium mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald" />
                Working for you right now
              </h4>
              <p className="text-white/80 text-sm">
                Your funds are being automatically optimized to earn the best returns in current market conditions.
              </p>
              <div className="flex items-center mt-2 text-xs text-white/50">
                <Clock size={12} className="mr-1" />
                <span>Last activity: 4m ago</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-white/70">Investment Safety</div>
                <div className="text-sm font-medium text-emerald">Protected</div>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald/50 rounded-full" style={{width: "98%"}}></div>
              </div>
            </div>
          </div>

          {/* Right side - Results */}
          <div className="space-y-4">
            {/* Key performance indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/60 mb-1 flex items-center">
                  <Percent size={12} className="mr-1 text-nova" />
                  APR Increase
                </div>
                <div className="text-xl font-bold font-mono text-nova">+3.8%</div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/60 mb-1 flex items-center">
                  <Shield size={12} className="mr-1 text-emerald" />
                  Success Rate
                </div>
                <div className="text-xl font-bold font-mono text-emerald">98.7%</div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-white/80">Your Benefit</div>
                <div className="text-sm text-white/60">Last 30 days</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-nova/20 to-nova/5">
                  <DollarSign size={20} className="text-nova" />
                </div>
                <div className="text-2xl font-bold font-mono">
                  <motion.span
                    className="inline-block text-nova"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    +$142.50
                  </motion.span>
                </div>
              </div>
              <div className="text-xs text-white/60 mt-1">
                Additional yield compared to standard investing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Secure processing notice */}
      <div className="px-5 py-2 bg-black/20 border-t border-white/5">
        <div className="flex items-center text-xs text-white/50">
          <Shield size={12} className="mr-1.5" />
          <span>Secure processing with your assets always in your control</span>
        </div>
      </div>
    </div>
  );
}
