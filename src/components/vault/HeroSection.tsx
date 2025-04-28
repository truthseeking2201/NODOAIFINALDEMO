
import React from "react";
import { KpiRibbon } from "./KpiRibbon";
import { Brain, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="relative pb-4 mb-4">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-nova/10 blur-[120px] opacity-70" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald/10 blur-[100px] opacity-70" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-orion/10 blur-[80px] opacity-70" />
      </div>

      {/* Main content - more compact */}
      <div className="relative z-10 max-w-[700px] mx-auto text-center mt-1 mb-4">
        <motion.div
          className="flex justify-center mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-nova/30 to-nova/10 p-2 rounded-full shadow-[0_0_15px_rgba(120,80,255,0.3)]">
            <Brain size={24} className="text-nova" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover <span className="gradient-text-nova font-extrabold">NODO AI</span> Vaults
        </motion.h1>

        <motion.p
          className="text-[#9CA3AF] text-lg font-light max-w-[580px] mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AI-powered vaults maximizing returns with smart risk management
        </motion.p>
      </div>

      {/* Stats ribbon with enhanced effects */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-6 shadow-lg shadow-nova/5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <KpiRibbon />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[150%] text-white/40 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </motion.div>
    </div>
  );
}
