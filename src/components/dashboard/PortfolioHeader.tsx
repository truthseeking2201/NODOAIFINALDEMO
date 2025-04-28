import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioHeaderProps {
  totalValue: number;
  totalProfit: number;
}

export function PortfolioHeader({ totalValue, totalProfit }: PortfolioHeaderProps) {
  const isProfitable = totalProfit >= 0;

  return (
    <div className="relative">
      {/* Background effect elements */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-[#FF8A00]/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6A36FC]/10 to-transparent rounded-full blur-3xl opacity-20" />

      {/* Header content */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            Your <span className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] bg-clip-text text-transparent ml-2">Portfolio</span>
          </h1>

          <div className="flex items-center mt-1 space-x-2">
            <p className="text-white/60 text-sm">
              Live snapshot of your vault positions
            </p>

            {totalValue > 0 && (
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2 py-0.5">
                <span className="text-sm font-medium">
                  ${totalValue.toLocaleString()}
                </span>

                {isProfitable ? (
                  <span className="flex items-center text-xs text-emerald font-medium">
                    <TrendingUp size={12} className="mr-0.5" />
                    +${totalProfit.toLocaleString()}
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-red-500 font-medium">
                    <TrendingDown size={12} className="mr-0.5" />
                    -${Math.abs(totalProfit).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
