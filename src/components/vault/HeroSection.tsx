
import React from "react";
import { KpiRibbon } from "./KpiRibbon";
import { Brain } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative pb-8 mb-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-nova/5 blur-[120px]" />
        <div className="absolute top-40 -right-60 w-[500px] h-[500px] rounded-full bg-emerald/5 blur-[100px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[700px] mx-auto text-center mt-10 mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-nova/20 to-nova/5 p-3 rounded-full">
            <Brain size={28} className="text-nova" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
          Discover <span className="gradient-text-nova font-extrabold">NODO AI</span> Vaults
        </h1>

        <p className="text-[#9CA3AF] text-xl font-light max-w-[600px] mx-auto">
          AI-powered vaults maximizing returns with smart risk management
        </p>
      </div>

      {/* Stats ribbon with glow effect */}
      <div className="relative z-10 mx-auto max-w-3xl bg-black/30 backdrop-blur-lg border border-white/5 rounded-2xl px-8 shadow-lg">
        <KpiRibbon />
      </div>
    </div>
  );
}
