import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Vault } from "@/types";
import { VaultData } from "@/types/vault";
import { adaptVaultsToVaultData } from "@/utils/vaultAdapter";

// Lazy load non-critical components
const NeuralActivityTicker = lazy(() => import('@/components/vault/NeuralActivityTicker').then(mod => ({ default: mod.NeuralActivityTicker })));
const VaultCarousel = lazy(() => import('@/components/vault/VaultCarousel').then(mod => ({ default: mod.VaultCarousel })));
const NODOAIxPromoBanner = lazy(() => import('@/components/vault/NODOAIxPromoBanner').then(mod => ({ default: mod.NODOAIxPromoBanner })));
const ActivitySection = lazy(() => import('@/components/vault/ActivitySection').then(mod => ({ default: mod.ActivitySection })));

// Simple loader component
const SectionLoader = () => (
  <div className="w-full py-8 flex justify-center">
    <LoadingState type="spinner" className="scale-150" />
  </div>
);

// Vault filter types
type VaultFilter = 'All' | 'Top APR' | 'Lowest Risk' | 'New';

export default function VaultCatalog() {
  const { data: rawVaults, isLoading, error, refetch } = useQuery<Vault[]>({
    queryKey: ['vaults'],
    queryFn: () => vaultService.getVaults(),
    retry: 3,
    retryDelay: 1000,
    staleTime: 60000, // 1 minute
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('All');
  const [showAnimation, setShowAnimation] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    neuralActivity: false,
    vaultGrid: false,
    nodoaix: false,
    activity: false
  });

  // Optimize scroll effects by simplifying the transformations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  // Progressive loading of sections
  useEffect(() => {
    // Show ticker animation faster for better UX
    const tickerTimer = setTimeout(() => {
      setShowAnimation(true);
      setVisibleSections(prev => ({ ...prev, neuralActivity: true }));
    }, 300);

    // Gradually load other sections
    const gridTimer = setTimeout(() => {
      setVisibleSections(prev => ({ ...prev, vaultGrid: true }));
    }, 600);

    const nodoaixTimer = setTimeout(() => {
      setVisibleSections(prev => ({ ...prev, nodoaix: true }));
    }, 900);

    const activityTimer = setTimeout(() => {
      setVisibleSections(prev => ({ ...prev, activity: true }));
    }, 1200);

    return () => {
      clearTimeout(tickerTimer);
      clearTimeout(gridTimer);
      clearTimeout(nodoaixTimer);
      clearTimeout(activityTimer);
    };
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
        {/* Simplified animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-nova/20 blur-[100px] opacity-40"
            style={{ y: y1 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero section with enhanced 3D effects */}
        <motion.section
          className="pt-2 pb-4 md:pt-3 md:pb-6 relative"
          style={{ opacity }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroSection />

          <AnimatePresence>
            {showAnimation && (
              <Suspense fallback={<div className="h-12 mt-6 bg-black/20 rounded-full animate-pulse" />}>
                {visibleSections.neuralActivity && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                  >
                    <NeuralActivityTicker />
                  </motion.div>
                )}
              </Suspense>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Mobile carousel for small screens */}
        <AnimatePresence>
          {isMobile && vaults.length > 0 && !isLoading && !error && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:hidden px-4"
            >
              <Suspense fallback={<SectionLoader />}>
                <VaultCarousel
                  vaults={filteredVaults}
                  isConnected={isConnected}
                  balance={balance || { usdc: 0 }}
                  activeVaultId={activeVaultId}
                  onVaultHover={handleVaultHover}
                  carouselApi={carouselApi}
                  setCarouselApi={setCarouselApi}
                />
              </Suspense>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Main vaults section */}
        <motion.section
          className="relative component-spacing"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: visibleSections.vaultGrid ? 1 : 0, y: visibleSections.vaultGrid ? 0 : 15 }}
          transition={{ duration: 0.5 }}
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

        {/* NODOAIx Section */}
        <motion.section
          className="component-spacing px-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: visibleSections.nodoaix ? 1 : 0, y: visibleSections.nodoaix ? 0 : 15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                <span className="gradient-text-amber">NODOAIx</span> Tokens
              </h2>
              <p className="text-white/70 mt-2">Intelligent yield optimization receipts with exclusive benefits</p>
            </div>
            <Suspense fallback={<SectionLoader />}>
              <NODOAIxPromoBanner />
            </Suspense>
          </div>
        </motion.section>

        {/* Live Activity section */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: visibleSections.activity ? 1 : 0, y: visibleSections.activity ? 0 : 15 }}
          transition={{ duration: 0.5 }}
          className="component-spacing"
        >
          <Suspense fallback={<SectionLoader />}>
            <ActivitySection />
          </Suspense>
        </motion.section>
      </div>
    </PageContainer>
  );
}
