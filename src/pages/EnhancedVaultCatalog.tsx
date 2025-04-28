import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { EnhancedHeroSection } from "@/components/vault/EnhancedHeroSection";
import { EnhancedVaultGrid } from "@/components/vault/EnhancedVaultGrid";
import { EnhancedActivitySection } from "@/components/vault/EnhancedActivitySection";
import { EnhancedNeuralActivityTicker } from "@/components/vault/EnhancedNeuralActivityTicker";
import { NeuralNetworkBackground } from "@/components/vault/NeuralNetworkBackground";
import { NODOAIxPromoBanner } from "@/components/vault/NODOAIxPromoBanner";
import { useWallet } from "@/hooks/useWallet";
import { VaultData } from "@/types/vault";
import { adaptVaultsToVaultData } from "@/utils/vaultAdapter";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Brain,
  SlidersHorizontal,
  ArrowUpDown,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
  Filter,
  Search,
  Cpu,
  Lock,
  Network
} from "lucide-react";

// Vault filter types
type VaultFilter = 'All' | 'Top APR' | 'Lowest Risk' | 'New';

export default function EnhancedVaultCatalog() {
  const { data: rawVaults, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Convert raw vaults to VaultData[] for component compatibility
  const vaults = React.useMemo<VaultData[]>(() => {
    if (!rawVaults) return [];
    return adaptVaultsToVaultData(rawVaults);
  }, [rawVaults]);

  const { isConnected, balance } = useWallet();
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrainAnimation, setShowBrainAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  // Trigger brain animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrainAnimation(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVaultHover = (id: string) => {
    setActiveVaultId(id);
  };

  // Filter vaults based on selected filter
  const filteredVaults = React.useMemo(() => {
    if (!vaults.length) return [];

    // First apply search query if any
    let filtered = vaults;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vault =>
        vault.name.toLowerCase().includes(query) ||
        vault.description.toLowerCase().includes(query)
      );
    }

    // Then apply category filter
    switch (activeFilter) {
      case 'Top APR':
        return [...filtered].sort((a, b) => b.apr - a.apr);
      case 'Lowest Risk':
        // Sort by risk level: low -> medium -> high
        return [...filtered].sort((a, b) => {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        });
      case 'New':
        // For demo purposes, just sort by ID - in a real app, would sort by creation date
        return [...filtered].sort((a, b) => a.id.localeCompare(b.id));
      case 'All':
      default:
        return filtered;
    }
  }, [vaults, activeFilter, searchQuery]);

  return (
    <PageContainer className="min-h-screen overflow-x-hidden bg-[#0A0B0D]">
      <div ref={containerRef} className="relative z-0">
        {/* Neural network background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Advanced Neural Network Visualization */}
          <NeuralNetworkBackground
            nodeCount={40}
            connectionDensity={0.2}
            nodesColor="rgba(249, 115, 22, 0.6)"
            connectionsColor="rgba(249, 115, 22, 0.15)"
            activeNodeColor="rgba(249, 115, 22, 0.9)"
            flowSpeed={0.8}
            className="opacity-30"
          />

          {/* Gradient orbs for additional depth */}
          <motion.div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-nova/10 blur-[120px]"
            style={{ y: y1 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-60 -right-40 w-[500px] h-[500px] rounded-full bg-orion/10 blur-[120px]"
            style={{ y: y2 }}
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Hero section with prominent headline */}
        <motion.section
          className="py-3 md:py-4 relative"
          style={{ opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <EnhancedHeroSection />
        </motion.section>

        {/* AI Neural Activity Ticker - Moved higher up */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-5 px-4 mt-1"
        >
          <EnhancedNeuralActivityTicker />
        </motion.section>

        {/* Vaults Section - moved higher up in the page */}
        <motion.section
          className="pt-4 pb-6 px-4 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="max-w-screen-xl mx-auto">
            {/* Section Header with AI Animation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nova/20 to-transparent flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={showBrainAnimation ? {
                        scale: [0.8, 1.2, 1],
                        opacity: [0, 1, 1],
                      } : {}}
                      transition={{ duration: 1 }}
                    >
                      <Brain size={20} className="text-nova" />
                    </motion.div>
                  </div>
                  {showBrainAnimation && (
                    <motion.div
                      className="absolute -inset-1 rounded-lg border border-nova/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.2, 1.4]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 5
                      }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-0.5">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova via-amber-500 to-orange-500">Yield Vaults</span>
                  </h2>
                  <p className="text-white/60 text-sm">
                    Technology-optimized returns for your assets
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full md:w-auto">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search vaults..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-44 bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-nova/50 focus:border-nova/50"
                  />
                </div>

                {/* Filter dropdown */}
                <div className="relative group">
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/90 transition-colors">
                    <Filter size={16} className="text-white/60" />
                    <span>{activeFilter}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg py-1 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {["All", "Top APR", "Lowest Risk", "New"].map((filter) => (
                      <button
                        key={filter}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 ${filter === activeFilter ? 'bg-white/10 text-nova' : 'text-white/80'}`}
                        onClick={() => setActiveFilter(filter as VaultFilter)}
                      >
                        {filter === "Top APR" && <TrendingUp size={14} className="text-nova" />}
                        {filter === "Lowest Risk" && <Shield size={14} className="text-emerald" />}
                        {filter === "New" && <Zap size={14} className="text-orion" />}
                        {filter === "All" && <SlidersHorizontal size={14} className="text-white/60" />}
                        <span>{filter}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort options */}
                <button className="flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/90 transition-colors">
                  <ArrowUpDown size={16} className="text-white/60" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            {/* Main Vault Catalog Grid */}
            <div className="mt-2">
              {isLoading ? (
                <LoadingState type="inline" className="flex justify-center py-12" />
              ) : error ? (
                <ErrorState
                  type="error"
                  title="Unable to Load Vaults"
                  message="We're experiencing technical difficulties. Please try again later."
                  onRetry={refetch}
                />
              ) : filteredVaults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/70 mb-4">No vaults match your filters</p>
                  <button
                    onClick={() => {
                      setActiveFilter('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <EnhancedVaultGrid
                  vaults={filteredVaults}
                  isConnected={isConnected}
                  balance={balance}
                  activeVaultId={activeVaultId}
                  onVaultHover={handleVaultHover}
                />
              )}
            </div>

            {/* NODOAIx Promo Banner */}
            <div className="mt-12 px-4">
              <NODOAIxPromoBanner />
            </div>
          </div>
        </motion.section>

        {/* Activity Section - with neuron visualization */}
        <motion.section
          className="py-12 px-4 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nova/20 to-transparent flex items-center justify-center">
                <Zap size={20} className="text-nova" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Latest Activities</h2>
                <p className="text-white/60 text-sm">
                  Recent transactions in the vaults
                </p>
              </div>
            </div>

            <EnhancedActivitySection />
          </div>
        </motion.section>

        {/* Enhanced Footer with AI branding */}
        <motion.div
          className="max-w-screen-xl mx-auto px-4 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="relative border-t border-white/10 pt-10">
            {/* Neural line animation */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-nova/80 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-nova" />
                  <h3 className="text-sm font-medium">Advanced Security</h3>
                </div>
                <p className="text-xs text-white/50">
                  Our system continuously monitors investments and market conditions to identify potential risks before they impact performance, providing robust protection for your assets.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Network size={16} className="text-orion" />
                  <h3 className="text-sm font-medium">Optimized Returns</h3>
                </div>
                <p className="text-xs text-white/50">
                  Our technology analyzes market data to identify opportunities for maximizing yields. The system works continuously to optimize investment strategies for better returns.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-emerald" />
                  <h3 className="text-sm font-medium">Risk Management</h3>
                </div>
                <p className="text-xs text-white/50">
                  We balance risk and reward with a sophisticated approach to investments. Select your preferred risk profile and our system will manage positions accordingly to match your strategy.
                </p>
              </div>
            </div>

            <div className="text-center border-t border-white/5 pt-6">
              <p className="text-xs text-white/40 max-w-xl mx-auto">
                NODO optimizes yield performance through advanced technology and algorithmic strategies.
                Past performance is not indicative of future results. Our systems continuously adapt to changing market conditions.
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-nova/50"></div>
                  <span>System v2.4</span>
                </div>
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orion/50"></div>
                  <span>Optimization Engine</span>
                </div>
                <div className="text-[10px] text-white/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald/50"></div>
                  <span>Risk Framework v1.8</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
