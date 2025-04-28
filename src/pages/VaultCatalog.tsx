import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { ActivitySection } from "@/components/vault/ActivitySection";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { UnifiedActivityFeed } from "@/components/vault/UnifiedActivityFeed";
import { NeuralActivityTicker } from "@/components/vault/NeuralActivityTicker";
import { FeaturedVaultPill } from "@/components/vault/FeaturedVaultPill";
import { VaultCarousel } from "@/components/vault/VaultCarousel";
import { Vault } from "@/types";
import { VaultData } from "@/types/vault";
import { adaptVaultsToVaultData } from "@/utils/vaultAdapter";

// Vault filter types
type VaultFilter = 'All' | 'Top APR' | 'Lowest Risk' | 'New';

export default function VaultCatalog() {
  const { data: rawVaults, isLoading, error, refetch } = useQuery<Vault[]>({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    retry: 3,
    retryDelay: 1000,
    // If we get an empty array or undefined, don't treat it as an error
    refetchOnWindowFocus: false,
  });

  // Convert Vault[] to VaultData[] for component compatibility
  const vaults = useMemo<VaultData[]>(() => {
    if (!rawVaults) return [];
    return adaptVaultsToVaultData(rawVaults);
  }, [rawVaults]);

  const { isConnected, balance } = useWallet();
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const { isMobile, isMd } = useBreakpoint();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('All');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(true);
    }, 500);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVaultHover = (id: string) => {
    if (!isMobile) {
      setActiveVaultId(id);
    }
  };

  // Filter vaults based on selected filter
  const filteredVaults = useMemo(() => {
    if (!vaults.length) return [];

    switch (activeFilter) {
      case 'Top APR':
        return [...vaults].sort((a, b) => b.apr - a.apr);
      case 'Lowest Risk':
        // Sort by risk level: low -> medium -> high
        return [...vaults].sort((a, b) => {
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        });
      case 'New':
        // For demo purposes, just sort by ID - in a real app, would sort by creation date
        return [...vaults].sort((a, b) => a.id.localeCompare(b.id));
      case 'All':
      default:
        return vaults;
    }
  }, [vaults, activeFilter]);

  return (
    <PageContainer className="page-container overflow-x-hidden">
      <div ref={containerRef} className="flex flex-col space-y-16 relative z-0">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-nova/20 blur-[100px] opacity-40"
            style={{ y: y1 }}
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full bg-orion/20 blur-[100px] opacity-40"
            style={{ y: y2 }}
            animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Hero section with 3D effects */}
        <motion.section
          className="section-spacing-compact md:section-spacing relative"
          style={{ opacity, scale }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroSection />

          <AnimatePresence>
            {showAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-8"
              >
                <NeuralActivityTicker />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Featured vaults capsules - internal pool names are hidden from users */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="px-4 flex flex-wrap justify-center gap-4 mt-8 mb-12"
        >
          <FeaturedVaultPill label="Trending" vaultName="DEEP-SUI" type="nova" metric="+24.8% APR" />
          <FeaturedVaultPill label="Most Stable" vaultName="SUI-USDC" type="emerald" metric="12.5% APR" />
          <FeaturedVaultPill label="Popular" vaultName="CETUS-SUI" type="orion" metric="$2.1M TVL" />
        </motion.section>

        {/* Mobile carousel for small screens */}
        <AnimatePresence>
          {isMobile && vaults.length > 0 && !isLoading && !error && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:hidden px-4"
            >
              <VaultCarousel
                vaults={filteredVaults}
                isConnected={isConnected}
                balance={balance || { usdc: 0 }}
                activeVaultId={activeVaultId}
                onVaultHover={handleVaultHover}
                carouselApi={carouselApi}
                setCarouselApi={setCarouselApi}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Main vaults section */}
        <motion.section
          className="relative component-spacing"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                AI-Powered <span className="gradient-text-nova">Yield Vaults</span>
              </h2>
              <div className="hidden md:flex space-x-2">
                {["All", "Top APR", "Lowest Risk", "New"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${filter === activeFilter ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveFilter(filter as VaultFilter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: isMobile ? 1 : 6 }).map((_, index) => (
                  <LoadingState
                    key={index}
                    type="card"
                    height={320}
                    className="w-full"
                  />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                type="error"
                title="Unable to Load Vaults"
                message="We encountered an issue while loading the vaults. Please try again later."
                onRetry={() => refetch()}
              />
            ) : filteredVaults.length > 0 ? (
              <motion.div
                className="component-spacing"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <VaultGrid
                  vaults={filteredVaults}
                  isConnected={isConnected}
                  balance={balance || { usdc: 0 }}
                  activeVaultId={activeVaultId}
                  onVaultHover={handleVaultHover}
                />
              </motion.div>
            ) : (
              <ErrorState
                type="info"
                title="No Vaults Available"
                message="There are no vaults available at this time. Please check back later."
              />
            )}
          </div>
        </motion.section>

        {/* Live Activity section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="component-spacing"
        >
          <ActivitySection />
        </motion.section>
      </div>
    </PageContainer>
  );
}
