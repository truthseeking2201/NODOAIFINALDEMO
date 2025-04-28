
import React, { useState, useEffect } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { NeuralNetworkBackground } from "@/components/vault/NeuralNetworkBackground";
import { motion, AnimatePresence } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Always show cursor in demo without auto-hiding
      setShowCursor(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    setMounted(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Persistent neural network background with parallax effect */}
      <div className="fixed inset-0 z-[var(--z-negative)] overflow-hidden pointer-events-none">
        <NeuralNetworkBackground
          nodeCount={40}
          connectionDensity={0.15}
          nodesColor="rgba(249, 115, 22, 0.5)"
          connectionsColor="rgba(249, 115, 22, 0.12)"
          activeNodeColor="rgba(249, 115, 22, 0.7)"
          flowSpeed={0.6}
          className="opacity-20"
        />

        {/* Ambient gradient orbs */}
        <motion.div
          className="absolute -top-[30%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-nova/5 blur-[150px]"
          style={{
            y: mounted ? scrollPosition * 0.1 : 0,
            opacity: 0.4
          }}
          animate={{ opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-[50%] -right-[20%] w-[50vw] h-[50vw] rounded-full bg-violet-500/5 blur-[120px]"
          style={{
            y: mounted ? scrollPosition * -0.05 : 0,
            opacity: 0.3
          }}
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Noise texture overlay for depth */}
      <div className="fixed inset-0 z-[var(--z-negative)] bg-noise opacity-[0.015] pointer-events-none"></div>

      {/* Custom cursor glow effect */}
      <AnimatePresence>
        {showCursor && (
          <motion.div
            className="fixed w-40 h-40 rounded-full pointer-events-none z-[var(--z-negative)] mix-blend-lighten"
            style={{
              left: mousePosition.x - 80,
              top: mousePosition.y - 80,
              background: "radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0) 70%)",
              opacity: 0.7
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          className="flex flex-col min-h-screen relative z-[var(--z-elevate)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AppHeader />
          <div className="flex-1 relative">
            {children}
          </div>
          <AppFooter />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
